import type { ReactNode } from 'react';

type Props = {
  title: string;
  body: string;
  illustration?: ReactNode;
  ctaLabel?: string;
  onCta?: () => void;
  /** e.g. link to other tab */
  secondaryLabel?: string;
  onSecondary?: () => void;
};

/**
 * Centered empty pattern: illustration + title + body + optional CTAs.
 * Uses design tokens from global.css.
 */
export function NutriaEmptyState({
  title,
  body,
  illustration,
  ctaLabel,
  onCta,
  secondaryLabel,
  onSecondary,
}: Props) {
  return (
    <div className="nutria-empty">
      {illustration ? <div className="nutria-empty__art" aria-hidden>{illustration}</div> : null}
      <h3 className="nutria-empty__title">{title}</h3>
      <p className="nutria-empty__body">{body}</p>
      {ctaLabel && onCta ? (
        <div className="nutria-empty__actions">
          <button type="button" className="btn-primary" onClick={onCta}>
            {ctaLabel}
          </button>
          {secondaryLabel && onSecondary ? (
            <button type="button" className="btn-ghost" onClick={onSecondary}>
              {secondaryLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** Minimal line-art: plate + fork for food / plan metaphor */
export function IllustrationEmptyPlate() {
  return (
    <svg className="nutria-empty__svg" viewBox="0 0 120 100" role="img" aria-label="">
      <ellipse cx="60" cy="58" rx="38" ry="14" fill="var(--border-soft)" opacity={0.85} />
      <ellipse cx="60" cy="50" rx="32" ry="10" fill="var(--surface-elevated)" stroke="var(--border)" />
      <path
        d="M40 36c0-6 4-10 9-10h22c5 0 9 4 9 10v4H40v-4z"
        fill="var(--tag-fresh-bg)"
        stroke="var(--tag-fresh-text)"
        strokeWidth="0.5"
        opacity={0.6}
      />
      <rect x="18" y="28" width="4" height="40" rx="1" fill="var(--text-muted)" opacity={0.45} />
      <rect x="98" y="32" width="3" height="36" rx="1" fill="var(--text-muted)" opacity={0.45} />
    </svg>
  );
}

export function IllustrationEmptyCart() {
  return (
    <svg className="nutria-empty__svg" viewBox="0 0 120 100" role="img" aria-label="">
      <rect x="30" y="40" width="60" height="36" rx="6" fill="var(--grocery-hero)" opacity={0.12} />
      <rect x="34" y="44" width="52" height="24" rx="3" fill="var(--surface-elevated)" stroke="var(--border)" />
      <path d="M44 32h32l4 8H40z" fill="var(--text-muted)" opacity={0.4} />
      <circle cx="48" cy="82" r="4" fill="var(--text-muted)" opacity={0.35} />
      <circle cx="76" cy="82" r="4" fill="var(--text-muted)" opacity={0.35} />
    </svg>
  );
}
