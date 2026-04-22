import type { ReactNode } from 'react';

type Props = {
  label: string;
  hint?: string;
  fieldId: string;
  children: ReactNode;
};

/** Persistent label + hint above control (MyFitnessPal-style clarity). Child input should use `id={fieldId}` and optional `aria-describedby={fieldId + '-hint'}`. */
export function FormField({ label, hint, fieldId, children }: Props) {
  return (
    <div className="form-field">
      <label htmlFor={fieldId} className="form-label">
        {label}
      </label>
      {hint ? (
        <p className="form-hint" id={`${fieldId}-hint`}>
          {hint}
        </p>
      ) : null}
      {children}
    </div>
  );
}
