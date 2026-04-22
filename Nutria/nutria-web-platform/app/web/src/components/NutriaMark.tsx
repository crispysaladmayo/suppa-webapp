import { useId } from 'react';

/**
 * Product mark: warm leaf + bowl — used in masthead and login, no emoji.
 */
export function NutriaMark({ className = '' }: { className?: string }) {
  const raw = useId();
  const gid = `nm${raw.replace(/:/g, '')}`;
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="8" y1="6" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d45842" />
          <stop offset="1" stopColor="#9e3526" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill={`url(#${gid})`} />
      <path
        d="M20 8c-4.5 0-8 4-8 9 0 5.5 3.2 9.4 6.8 10.2.4 4.1 1.2 4.8 1.2 4.8s.8.6 1.2-.2c.3-1.6.8-3.2 1.1-4.4 3.3-.8 5.7-4.3 5.7-8.4 0-5-3.5-9-8-9z"
        fill="rgba(255,255,255,0.92)"
      />
      <path
        d="M20 8c1.2 1.2 1.6 2.4 1.2 3.2-.2 1.2-1.1 1.2-1.1 1.2s.5 0 .7-.1c.7-.1 1.1-.1 1.1-.1 2.3 0 4.2-2.4 4.1-3.1-.1-.3-.6-.1-1.1.2-.2.1-.3.1-.3.1z"
        fill="rgba(196,77,52,0.25)"
      />
      <ellipse cx="20" cy="30" rx="7" ry="2.2" fill="rgba(31,26,23,0.1)" />
    </svg>
  );
}
