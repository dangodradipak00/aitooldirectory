'use client';

import { useActionState } from 'react';
import type { FormState } from './actions';
import styles from './admin.module.css';

export default function AdminForm({ action, children, submitLabel }: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  children: React.ReactNode;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className={styles.editorForm}>
      {children}
      {state?.error && <p className={styles.formError} role="alert">{state.error}</p>}
      {state?.success && <p className={styles.formSuccess} role="status">{state.success}</p>}
      <button className={styles.primaryButton} disabled={pending} type="submit">{pending ? 'Saving…' : submitLabel}</button>
    </form>
  );
}
