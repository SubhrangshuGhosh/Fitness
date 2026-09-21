import './Logo.css';

function Logo({ size = 32, showText = true }) {
  return (
    <div id="logo-root" className="logo-root">
      <svg
        id="logo-mark"
        className="logo-mark"
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Athlos logo"
      >
        <defs>
          <linearGradient id="athlos-logo-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="55%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>

        <rect width="64" height="64" rx="14" fill="url(#athlos-logo-bg)" />

        {/* The A / peak */}
        <path
          d="M18 46 L32 18 L46 46"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Crossbar */}
        <path
          d="M25 38 L39 38"
          stroke="#ffffff"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Summit dot */}
        <circle cx="32" cy="18" r="3" fill="#fbbf24" />
      </svg>

      {showText && (
        <span id="logo-text" className="logo-text">
          Athlos
        </span>
      )}
    </div>
  );
}

export default Logo;