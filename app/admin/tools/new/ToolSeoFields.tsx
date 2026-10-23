'use client';

import { createContext, useContext, useState } from 'react';
import { getToolSeoDescription, getToolSeoTitle } from '@/lib/tool-seo';
import styles from '../../admin.module.css';

type ToolNameContextValue = {
  toolName: string;
  setToolName: (name: string) => void;
};

const ToolNameContext = createContext<ToolNameContextValue | null>(null);

function useToolName() {
  const context = useContext(ToolNameContext);
  if (!context) throw new Error('Tool SEO fields must be inside ToolSeoProvider.');
  return context;
}

export function ToolSeoProvider({ initialName = '', children }: { initialName?: string; children: React.ReactNode }) {
  const [toolName, setToolName] = useState(initialName);
  return <ToolNameContext value={{ toolName, setToolName }}>{children}</ToolNameContext>;
}

export function ToolNameField({ required = false }: { required?: boolean }) {
  const { toolName, setToolName } = useToolName();
  return <input name="name" required={required} value={toolName} onChange={(event) => setToolName(event.target.value)} />;
}

export default function ToolSeoFields() {
  const { toolName } = useToolName();
  const title = getToolSeoTitle(toolName.trim());
  const description = getToolSeoDescription(toolName.trim());

  return (
    <section className={styles.formCard}>
      <h2>SEO</h2>
      <label>
        <span className={styles.fieldLabelRow}>
          <span>SEO title</span>
          <span className={styles.characterCount} aria-live="polite">{title.length} characters</span>
        </span>
        <input name="seoTitle" value={title} readOnly />
      </label>
      <label>
        <span className={styles.fieldLabelRow}>
          <span>SEO description</span>
          <span className={styles.characterCount} aria-live="polite">{description.length} characters</span>
        </span>
        <textarea name="seoDescription" rows={5} value={description} readOnly />
      </label>
      <small className={styles.fieldHelp}>Automatically generated from the tool name. This format is used on every tool page.</small>
    </section>
  );
}
