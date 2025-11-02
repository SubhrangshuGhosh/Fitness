import React from 'react';

export const SVGIcon = ({ name, className = "", ...props }) => {
  const icons = {
    download: (
      <svg className={className} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 10L12 15M12 15L7 10M12 15V3" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    save: (
      <svg className={className} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    regenerate: (
      <svg className={className} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" 
          stroke="currentColor" strokeWidth="2"/>
        <path d="M16 8L20 4V8H16Z" fill="currentColor"/>
        <path d="M4 16L8 20H4V16Z" fill="currentColor"/>
        <path d="M20 12C20 16.4183 16.4183 20 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M4 12C4 7.58172 7.58172 4 12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    calendar: (
      <svg className={className} viewBox="0 0 24 24" fill="none" {...props}>
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 14H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 14H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 14H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 18H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 18H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    clock: (
      <svg className={className} viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    target: (
      <svg className={className} viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    workout: (
      <svg className={className} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M17 8L21 12L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 8L3 12L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 4L10 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    tips: (
      <svg className={className} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
          stroke="currentColor" strokeWidth="2"/>
        <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    motivation: (
      <svg className={className} viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M14.8284 14.8284C13.2663 16.3905 10.7337 16.3905 9.17157 14.8284C7.60948 13.2663 7.60948 10.7337 9.17157 9.17157C10.7337 7.60948 13.2663 7.60948 14.8284 9.17157" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
          stroke="currentColor" strokeWidth="2"/>
        <path d="M8 15C8 15 9 17 12 17C15 17 16 15 16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    schedule: (
      <svg className={className} viewBox="0 0 24 24" fill="none" {...props}>
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 18H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  };

  return icons[name] || null;
};

export default SVGIcon;