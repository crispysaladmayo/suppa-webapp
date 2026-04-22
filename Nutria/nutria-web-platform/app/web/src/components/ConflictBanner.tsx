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
  let title = 'Ada masalah saat memuat data';
  let body = msg;
  let variant: 'conflict' | 'auth' | 'default' = 'default';

  if (isApiError(error)) {
    if (error.code === 'conflict') {
      title = 'Perubahan bentrok';
      body =
        'Data sudah diubah di perangkat atau jendela lain. Muat ulang untuk melihat versi terbaru, lalu coba lagi.';
      variant = 'conflict';
    } else if (error.code === 'unauthorized') {
      title = 'Sesi berakhir';
      body = 'Masuk kembali untuk melanjutkan.';
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
          Muat ulang
        </button>
      ) : null}
    </div>
  );
}
