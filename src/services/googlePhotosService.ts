import type { Photo, Album } from '../types';

let API_KEY = '';
let CLIENT_ID = '';
// Benötigte Berechtigungen:
// - readonly: Zum Ansehen von Fotos und Alben.
// - appendonly: Zum Hinzufügen von Fotos zu Alben (z.B. Archiv).
// - sharing: Zum Erstellen von neuen Alben (z.B. das Archiv-Album), was für die Archivierungsfunktion benötigt wird.
const SCOPES = [
    'https://www.googleapis.com/auth/photoslibrary.readonly',
    'https://www.googleapis.com/auth/photoslibrary.appendonly',
    'https://www.googleapis.com/auth/photoslibrary.sharing'
];

// Typen für GAPI-Antworten
interface GapiResponse<T> {
  result: T;
}

interface MediaItemsList {
  mediaItems?: any[];
  nextPageToken?: string;
}

interface AlbumsList {
  albums?: any[];
  nextPageToken?: string;
}

interface CreatedAlbum {
  id: string;
  title: string;
}


let tokenClient: any = null;
let onSignedInChanged: (signedIn: boolean) => void;

/**
 * Callback function to handle the response from the OAuth2 server.
 * Sets the token for the GAPI client and updates the sign-in status.
 */
function tokenCallback(tokenResponse: any) {
  if (tokenResponse && tokenResponse.access_token) {
    window.gapi.client.setToken({ access_token: tokenResponse.access_token });
    if (onSignedInChanged) onSignedInChanged(true);
  } else {
    // User closed the popup or denied access
    console.warn("User did not grant access or an error occurred.", tokenResponse);
    if (onSignedInChanged) onSignedInChanged(false);
  }
}

/**
 * Initializes both GAPI client for API calls and GIS token client for authentication.
 * Resolves the promise only when both are successfully initialized.
 * This function now runs sequentially to prevent race conditions.
 */
export async function init(apiKey: string, clientId: string, onSignInChange: (signedIn: boolean) => void): Promise<void> {
  API_KEY = apiKey;
  CLIENT_ID = clientId;
  onSignedInChanged = onSignInChange;

  if (!API_KEY) {
      return Promise.reject(new Error("API-Schlüssel fehlt. Bitte setzen Sie die Umgebungsvariable GOOGLE_API_KEY."));
  }
  if (!CLIENT_ID) {
      return Promise.reject(new Error("Client-ID fehlt. Bitte setzen Sie die Umgebungsvariable GOOGLE_CLIENT_ID."));
  }

  // 1. Initialize Google Identity Services (GIS) for authentication
  const gisPromise = new Promise<void>((resolve, reject) => {
    const checkGisReady = () => {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        try {
          tokenClient = window.google.accounts.oauth2.initTokenClient({
              client_id: CLIENT_ID,
              scope: SCOPES.join(' '), // Hier für initTokenClient zusammenfügen, aber die detaillierte Anfrage wird durch das Array-Format beim Anfordern ausgelöst.
              callback: tokenCallback,
              error_callback: (error: any) => {
                  console.error('GIS Auth Fehler:', error);
                  reject(new Error(`Fehler bei der Google Authentifizierung: ${error.type || 'Unbekannter Fehler'}`));
              },
          });
          console.log("GIS token client initialized.");
          resolve();
        } catch (e: any) {
          console.error("Fehler bei GIS Token Client Initialisierung:", e);
          reject(new Error("Fehler bei GIS Token Client Initialisierung."));
        }
      } else {
        setTimeout(checkGisReady, 100);
      }
    };
    checkGisReady();
  });
  
  await gisPromise;

  // 2. Initialize Google API Client (GAPI) for API calls
  const gapiPromise = new Promise<void>((resolve, reject) => {
    window.gapi.load('client', () => {
      window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest"],
      }).then(() => {
        console.log("GAPI client initialized.");
        resolve();
      }).catch((e: any) => {
        console.error("Fehler bei GAPI-Client-Initialisierung:", e);
        reject(new Error(`Fehler bei GAPI-Client-Initialisierung: ${e.details || 'Unbekannter Fehler'}`));
      });
    });
  });
  
  await gapiPromise;
  
  console.log("Google services initialized successfully.");
}


/**
 * Starts the Google sign-in process by requesting an access token.
 */
export function signIn(): void {
  if (!tokenClient) {
    throw new Error("GIS Token Client ist nicht initialisiert.");
  }
  // Erzwingt den Zustimmungsbildschirm ('consent'), um sicherzustellen, dass die 
  // neuen, korrekten Berechtigungen vom Benutzer erteilt werden. 
  // Dies verhindert Caching-Probleme mit veralteten Tokens.
  tokenClient.requestAccessToken({ prompt: 'consent' });
}

/**
 * Signs the user out by revoking the current access token.
 */
export function signOut(): void {
  const token = window.gapi.client.getToken();
  if (token && window.google && window.google.accounts) {
    window.google.accounts.oauth2.revoke(token.access_token, () => {
      console.log("Google token revoked.");
      window.gapi.client.setToken(null);
      if (onSignedInChanged) onSignedInChanged(false);
    });
  } else {
      if (onSignedInChanged) onSignedInChanged(false);
  }
}

/**
 * Ruft die letzten Fotos des Benutzers ab.
 */
export async function getRecentPhotos(count: number = 50): Promise<Photo[]> {
  const response: GapiResponse<MediaItemsList> = await window.gapi.client.photoslibrary.mediaItems.list({ pageSize: count });
  const items = response.result.mediaItems || [];
  return items
    .filter((item: any) => item.mediaMetadata) // Filtert leere Metadaten raus
    .map((item: any) => ({
      id: item.id,
      url: `${item.baseUrl}=d`, // '=d' für Originalbild
      thumbnailUrl: `${item.baseUrl}=w250-h250-c`, // '=w...-h...-c' für zugeschnittene Thumbnails
      filename: item.filename,
      path: '',
      type: item.mediaMetadata.video ? 'video' : 'image',
      source: 'google',
      isFavorite: !!item.mediaMetadata.favorite,
  }));
}

/**
 * Ruft alle Alben des Benutzers ab.
 */
export async function getAlbums(): Promise<Album[]> {
    let albums: Album[] = [];
    let nextPageToken: string | undefined = undefined;

    do {
        const response: GapiResponse<AlbumsList> = await window.gapi.client.photoslibrary.albums.list({
            pageSize: 50,
            pageToken: nextPageToken
        });
        const items = response.result.albums || [];
        const mappedAlbums = items
            .filter((album: any) => album.isWriteable) // Nur schreibbare Alben anzeigen
            .map((album: any) => ({
                id: album.id,
                title: album.title,
            }));
        albums = albums.concat(mappedAlbums);
        nextPageToken = response.result.nextPageToken;
    } while (nextPageToken);

    return albums;
}

/**
 * Fügt ein Foto zu einem bestimmten Album hinzu.
 */
export async function addPhotoToAlbum(photoId: string, albumId: string): Promise<void> {
    await window.gapi.client.photoslibrary.albums.batchAddMediaItems({
        albumId: albumId,
        mediaItemIds: [photoId],
    });
}

/**
 * Erstellt ein neues Album.
 */
export async function createAlbum(title: string): Promise<Album> {
    const response: GapiResponse<CreatedAlbum> = await window.gapi.client.photoslibrary.albums.create({
        album: { title },
    });
    const result = response.result;
    return {
        id: result.id,
        title: result.title,
    };
}

/**
 * "Archiviert" ein Foto, indem es in ein spezielles Album verschoben wird.
 * Wenn das Album nicht existiert, wird es erstellt.
 */
export async function archivePhoto(photoId: string): Promise<void> {
    const archiveAlbumName = "Swiper-Archiv";
    let albums = await getAlbums();
    let archiveAlbum = albums.find(a => a.title === archiveAlbumName);

    if (!archiveAlbum) {
        archiveAlbum = await createAlbum(archiveAlbumName);
    }

    if (archiveAlbum && archiveAlbum.id) {
        await addPhotoToAlbum(photoId, archiveAlbum.id);
    } else {
        throw new Error("Konnte Archiv-Album nicht finden oder erstellen.");
    }
}