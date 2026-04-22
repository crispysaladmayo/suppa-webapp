type IconProps = { size?: number; active?: boolean };

const stroke = (active?: boolean) => (active ? 'var(--nav-active)' : 'var(--nav-idle)');

export function IconHariIni({ size = 22, active }: IconProps) {
  const c = stroke(active);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke={c} strokeWidth="1.6" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconRencana({ size = 22, active }: IconProps) {
  const c = stroke(active);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke={c} strokeWidth="1.6" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconBelanja({ size = 22, active }: IconProps) {
  const c = stroke(active);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.4" fill={c} />
      <circle cx="17" cy="20" r="1.4" fill={c} />
    </svg>
  );
}

export function IconPrep({ size = 22, active }: IconProps) {
  const c = stroke(active);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 10c0-3 2.5-6 7-6s7 3 7 6v3H5v-3z"
        stroke={c}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M5 13h14v3a4 4 0 01-4 4H9a4 4 0 01-4-4v-3z" stroke={c} strokeWidth="1.6" />
    </svg>
  );
}
