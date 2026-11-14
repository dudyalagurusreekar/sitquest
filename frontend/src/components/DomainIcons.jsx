/**
 * Domain Vector Icons in the clean, sleek vector style of Footer.jsx.
 * Replaces generic OS emojis with high-end SVG icons.
 */

export function MultimediaIcon({ className = 'w-5 h-5', color = '#A879E6' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="13.5" cy="6.5" r=".75" fill={color} />
      <circle cx="17.5" cy="10.5" r=".75" fill={color} />
      <circle cx="8.5" cy="7.5" r=".75" fill={color} />
      <circle cx="6.5" cy="12.5" r=".75" fill={color} />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z" />
    </svg>
  );
}

export function VideoEditingIcon({ className = 'w-5 h-5', color = '#2EEED0' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2.5" />
      <line x1="2" y1="9" x2="22" y2="9" />
      <line x1="6" y1="4" x2="8.5" y2="9" />
      <line x1="11" y1="4" x2="13.5" y2="9" />
      <line x1="16" y1="4" x2="18.5" y2="9" />
      <polygon points="10 12.5 15 15 10 17.5 10 12.5" fill={color} />
    </svg>
  );
}

export function DatabaseIcon({ className = 'w-5 h-5', color = '#7C9BFF' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </svg>
  );
}

export function ContentWritingIcon({ className = 'w-5 h-5', color = '#F472B6' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 19l7-7 3 3-7 7-3 1 1-4z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" fill={color} />
    </svg>
  );
}

export function PptIcon({ className = 'w-5 h-5', color = '#FBBF24' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <path d="M7 12l3-3 2 2 4-4" />
      <polyline points="13 7 16 7 16 10" />
    </svg>
  );
}

export function WebDevIcon({ className = 'w-5 h-5', color = '#34D399' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  );
}

export function DomainIcon({ domain, className = 'w-4 h-4', color }) {
  switch (domain) {
    case 'MULTIMEDIA':
      return <MultimediaIcon className={className} color={color || '#A879E6'} />;
    case 'VIDEO EDITING':
      return <VideoEditingIcon className={className} color={color || '#2EEED0'} />;
    case 'DATABASE':
      return <DatabaseIcon className={className} color={color || '#7C9BFF'} />;
    case 'CONTENT WRITING':
      return <ContentWritingIcon className={className} color={color || '#F472B6'} />;
    case 'PPT':
      return <PptIcon className={className} color={color || '#FBBF24'} />;
    case 'WEB DEVELOPMENT':
      return <WebDevIcon className={className} color={color || '#34D399'} />;
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color || '#A879E6'} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
  }
}
