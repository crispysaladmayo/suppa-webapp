import { isApiError } from '../api/ApiError.js';

type Props = {
  error: unknown;
  onRefresh?: () => void;
  contextLabel?: string;
};

/**
 * Maps API conflict / auth failures to a calm, recovery-first banner (Indonesian copy).
 */
export function ConflictOrErrorBanner({ error, onRefresh, contextLabel }: Props) {
  if (!error) return null;
  const msg = error instanceof Error ? error.message : String(error);
  let title = 'Terjadi masalah';
  let body = msg;
  let variant: 'conflict' | 'auth' | 'default' = 'default';

  if (isApiError(error)) {
    if (error.code === 'conflict') {
      title = 'Versi data tidak sama';
      body =
        'Kemungkinan data pernah diubah di perangkat atau tab lain. Muat ulang halaman untuk versi terbaru, lalu coba lagi.';
      variant = 'conflict';
    } else if (error.code === 'unauthorized') {
      title = 'Sesi berakhir';
      body = 'Masuk lagi untuk melanjutkan dengan aman dari titik terakhir.';
      variant = 'auth';
    }
  }

  return (
    <div
      className={`ux-banner ux-banner--${variant}`}
      role="alert"
    >
      <p className="ux-banner__title">
        {contextLabel ? `${contextLabel} — ` : null}
        {title}
      </p>
      <p className="ux-banner__body">{body}</p>
      {onRefresh ? (
        <button type="button" className="btn-ghost ux-banner__action" onClick={onRefresh}>
          Muat ulang halaman
        </button>
      ) : null}
    </div>
  );
}
