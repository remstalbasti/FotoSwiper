# Foto-Swiper

## Beschreibung

Foto-Swiper ist eine moderne Web-Anwendung, die das Sortieren von Fotos und Videos zu einem schnellen und intuitiven Erlebnis macht. Nutzer können Bildersammlungen aus lokalen Ordnern oder direkt aus ihrem Google-Fotos-Konto laden und sie mit einer einfachen Wisch-Geste (Swipen) organisieren.

Die App ist als Single-Page-Application (SPA) konzipiert und nutzt moderne Web-APIs wie die File System Access API, um eine nahtlose Interaktion mit lokalen Dateien direkt im Browser zu ermöglichen.

## Features

- **Multi-Source-Unterstützung**:
  - **Lokale Ordner**: Öffnen Sie einen Ordner auf Ihrem Computer. Die App lädt rekursiv alle unterstützten Bild- und Videodateien.
  - **Google Fotos**: Verbinden Sie Ihr Google-Konto, um die letzten 50 Medien zu laden und zu sortieren.
  - **Demo-Modus**: Testen Sie die App mit vorkonfigurierten Beispielbildern, ohne eigene Daten zu verwenden.
- **Intuitive Wisch-Steuerung**:
  - Sortieren Sie Fotos durch einfaches Wischen nach links oder rechts.
  - Die Aktion für die Wisch-Richtung (Löschen/Behalten) ist in den Einstellungen konfigurierbar.
- **Effizientes Organisieren**:
  - **Verschieben**: Verschieben Sie Fotos in Alben (Unterordner bei lokalen Dateien).
  - **Album-Erstellung**: Erstellen Sie neue Alben/Ordner direkt aus der App heraus (nur für lokale Quellen).
  - **"Super-Verschieben"**: Verschieben Sie ein Foto mit einem Mittelklick sofort in das zuletzt verwendete Album – ideal für das schnelle Sortieren von Serien.
- **Dateiverwaltung**:
  - **Umbenennen**: Benennen Sie lokale Dateien direkt in der Vorschau um.
  - **Favoriten**: Markieren Sie lokale Dateien mit einem Stern als Favorit (fügt `_FAV` zum Dateinamen hinzu).
- **Moderne User Experience**:
  - **Video-Unterstützung**: Videos können wie Fotos betrachtet und sortiert werden. Es werden automatisch Thumbnails generiert.
  - **Vollbildmodus**: Betrachten Sie Bilder und Videos ablenkungsfrei.
  - **Responsives Design**: Optimiert für Desktop und mobile Endgeräte.
  - **Flüssige Animationen**: Dank Framer Motion für ein ansprechendes Nutzererlebnis.
  - **Tastatur-Shortcuts**: Nutzen Sie `Enter` und `Escape` beim Umbenennen von Dateien.

## Technologie-Stack

- **Frontend**: React, TypeScript
- **Build-Tool**: Vite
- **Styling**: Tailwind CSS
- **Animationen**: Framer Motion
- **APIs**:
  - **File System Access API**: Für den direkten Zugriff auf lokale Ordner.
  - **Google Photos Library API**: Für die Integration mit Google Fotos.
  - **Google Identity Services**: Für die Authentifizierung.

## Setup & Installation

Folgen Sie diesen Schritten, um das Projekt lokal auszuführen.

### Voraussetzungen

- [Node.js](https://nodejs.org/) (Version 18 oder höher)
- [npm](https://www.npmjs.com/) oder ein anderer Paketmanager wie [Yarn](https://yarnpkg.com/)

### Installation

1.  **Repository klonen**:
    ```bash
    git clone https://github.com/IHR_BENUTZERNAME/foto-swiper.git
    cd foto-swiper
    ```

2.  **Abhängigkeiten installieren**:
    ```bash
    npm install
    ```

### Konfiguration (für Google Fotos)

Die Nutzung lokaler Ordner und des Demo-Modus erfordert keine Konfiguration. Um die Google-Fotos-Integration zu nutzen, benötigen Sie einen API-Schlüssel und eine OAuth 2.0 Client-ID.

1.  Gehen Sie zur [Google Cloud Console](https://console.cloud.google.com/).
2.  Erstellen Sie ein neues Projekt oder wählen Sie ein bestehendes aus.
3.  Aktivieren Sie die **Photos Library API**.
4.  Erstellen Sie unter "APIs & Dienste" -> "Anmeldedaten":
    - Einen **API-Schlüssel**.
    - Eine **OAuth 2.0-Client-ID** vom Typ "Webanwendung". Fügen Sie unter "Autorisierte JavaScript-Quellen" die URL hinzu, unter der die App lokal läuft (z.B. `http://localhost:5173`).
5.  Die App wird Sie beim ersten Verbindungsversuch nach diesen beiden Anmeldedaten fragen. Sie werden nicht im Code gespeichert.

### App ausführen

Starten Sie den Vite-Entwicklungsserver:

```bash
npm run dev
```

Die Anwendung ist nun unter der im Terminal angezeigten Adresse (standardmäßig `http://localhost:5173`) erreichbar.

## Benutzung

1.  **Startbildschirm**: Wählen Sie eine der drei Optionen:
    - **Lokalen Ordner öffnen**: Öffnet einen Dateidialog, in dem Sie einen Ordner auf Ihrem Computer auswählen können.
    - **Mit Google Fotos verbinden**: Startet den Anmeldevorgang für Ihr Google-Konto.
    - **Demos ausprobieren**: Zeigt eine Auswahl an Beispiel-Ordnern an.

2.  **Rasteransicht**: Nach der Auswahl einer Quelle sehen Sie eine Übersicht aller geladenen Medien. Klicken Sie auf ein Bild, um zur Wisch-Ansicht zu gelangen.

3.  **Wisch-Ansicht (Swiper)**:
    - **Wischen**: Nach links/rechts wischen, um die Standardaktion (Behalten) oder die Löschaktion auszuführen.
    - **Aktionsknöpfe**: Verwenden Sie die Knöpfe unten für "Behalten" (grün), "Löschen" (rot) oder "Verschieben" (blau).
    - **Verschieben**: Der blaue Knopf öffnet ein Modal mit allen verfügbaren Alben.
    - **Umbenennen/Favoriten**: Nutzen Sie die Icons oben rechts am Bild.

## Deployment

Das Projekt ist für ein automatisches Deployment auf **GitHub Pages** konfiguriert.

-   **Workflow**: Die Datei `.github/workflows/deploy.yml` definiert eine GitHub Action.
-   **Trigger**: Bei jedem Push auf den `main`-Branch wird der Workflow automatisch ausgeführt.
-   **Prozess**:
    1.  Die Anwendung wird mit `npm run build` gebaut.
    2.  Die erstellten statischen Dateien aus dem `dist`-Verzeichnis werden auf den `gh-pages`-Branch des Repositories gepusht.
-   **Konfiguration**: Die `vite.config.ts` enthält die Einstellung `base: '/foto-swiper/'`, um sicherzustellen, dass die Pfade der Assets auf GitHub Pages korrekt sind.

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Details finden Sie in der Lizenzansicht innerhalb der App.

## Und sonst noch

Wenn Dir das Projekt gefällt, star or watch me please
Thank you

