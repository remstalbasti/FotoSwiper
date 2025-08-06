import React from 'react';

type IconProps = {
    className?: string;
    fill?: string;
}

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export const FolderArrowDownIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
);

export const CameraIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

export const FolderIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

export const ComputerDesktopIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h9.75a2.25 2.25 0 012.25 2.25z" />
    </svg>
);

export const PlayCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
  </svg>
);

export const GooglePhotosIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.7 36c-1.933 0-3.5-1.567-3.5-3.5V22h-4.7c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5H8.2V4.5c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5v8.5H26V4.5c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5v8.5h4.5c1.933 0 3.5 1.567 3.5 3.5s-1.567 3.5-3.5 3.5H30v10.5c0 1.933-1.567 3.5-3.5 3.5s-3.5-1.567-3.5-3.5V22H15.2v10.5c0 1.933-1.567 3.5-3.5 3.5z" fill="#FBBC04"></path>
        <path d="M32.5 1H26v7.2h6.5c1.933 0 3.5 1.567 3.5 3.5s-1.567 3.5-3.5 3.5H26V29c0 1.933-1.567 3.5-3.5 3.5s-3.5-1.567-3.5-3.5V15.2H8.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5h11.2c1.933 0 3.5-1.567 3.5-3.5S21.666 1 19.733 1h-8.2c-1.933 0-3.5 1.567-3.5 3.5v4.7H1v10.5c0 1.933 1.567 3.5 3.5 3.5h4.7v7.3c0 1.933 1.567 3.5 3.5 3.5h7.3c1.933 0 3.5-1.567 3.5-3.5V26h7.3c1.933 0 3.5-1.567 3.5-3.5V11.8H32.5c1.933 0 3.5-1.567 3.5-3.5S34.433 1 32.5 1z" fill-opacity="0.2"></path>
        <path d="M32.5,1H26v7.2h6.5c1.933,0,3.5,1.567,3.5,3.5s-1.567,3.5-3.5,3.5H26V29c0,1.933-1.567,3.5-3.5,3.5s-3.5-1.567-3.5-3.5V15.2H8.5c-1.933,0-3.5-1.567-3.5-3.5S6.567,8.2,8.5,8.2h11.2c1.933,0,3.5-1.567,3.5-3.5S21.666,1,19.733,1h-8.2C9.6,1,8.033,2.567,8.033,4.5v4.7H3.5c-1.933,0-3.5,1.567-3.5,3.5v10.5c0,1.933,1.567,3.5,3.5,3.5h4.7v7.3c0,1.933,1.567,3.5,3.5,3.5h7.3c1.933,0,3.5-1.567,3.5-3.5V26h7.3c1.933,0,3.5-1.567,3.5-3.5V11.8H32.5c1.933,0,3.5-1.567,3.5-3.5S34.433,1,32.5,1z" fill-opacity="0.2"></path>
        <path d="M11.733 1c-1.933 0-3.5 1.567-3.5 3.5v8.5H3.5c-1.933 0-3.5 1.567-3.5 3.5s1.567 3.5 3.5 3.5h4.733v10.5c0 1.933 1.567 3.5 3.5 3.5s3.5-1.567 3.5-3.5V22h10.5v10.5c0 1.933 1.567 3.5 3.5 3.5s3.5-1.567 3.5-3.5V22h4.5c1.933 0 3.5 1.567 3.5-3.5s-1.567-3.5-3.5-3.5H30V4.5c0-1.933-1.567-3.5-3.5-3.5s-3.5 1.567 3.5-3.5v8.5H15.233V4.5c0-1.933-1.567-3.5-3.5-3.5z" fill="#EA4335"></path>
        <g>
            <path d="M15.233 13V4.5c0-1.933-1.567-3.5-3.5-3.5s-3.5 1.567-3.5 3.5v18c0 1.933 1.567 3.5 3.5 3.5s3.5-1.567 3.5-3.5V13z" fill="#4285F4"></path>
            <path d="M26.5 22v10.5c0 1.933 1.567 3.5 3.5 3.5s3.5-1.567 3.5-3.5V11.8H22.767c-1.933 0-3.5 1.567-3.5 3.5s1.567 3.5 3.5 3.5H26.5z" fill="#34A853"></path>
        </g>
    </svg>
);

export const PencilIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12.75l-2.625 2.625M17.25 15l-2.625 2.625m-3.375-3.375l-2.625 2.625m2.625-2.625l2.625 2.625" />
   </svg>
);

export const XMarkIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const StarIcon: React.FC<IconProps> = ({ className, fill = 'none' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={fill} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 21.1a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

export const KeyIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);

export const ArrowsPointingOutIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 8.25v-4.5m0 4.5h4.5m-4.5 0L9 3.75M20.25 8.25v-4.5m0 4.5h-4.5m4.5 0L15 3.75M3.75 15.75v4.5m0-4.5h4.5m-4.5 0L9 20.25M20.25 15.75v4.5m0-4.5h-4.5m4.5 0L15 20.25" />
    </svg>
);
