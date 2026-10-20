'use client';

import { useRef, useState } from 'react';
import styles from '../../admin.module.css';

type TextRow = { id: number; value: string };

function TextList({ label, name, tone, initialValues = [] }: { label: string; name: 'pros' | 'cons'; tone: 'positive' | 'negative'; initialValues?: string[] }) {
  const initialRows = initialValues.length ? initialValues.map((value, index) => ({ id: index + 1, value })) : [{ id: 1, value: '' }];
  const nextId = useRef(initialRows.length + 1);
  const [rows, setRows] = useState<TextRow[]>(initialRows);
  const add = () => setRows((current) => [...current, { id: nextId.current++, value: '' }]);
  const remove = (id: number) => setRows((current) => current.length === 1 ? [{ ...current[0], value: '' }] : current.filter((row) => row.id !== id));

  return (
    <div className={`${styles.structuredList} ${tone === 'positive' ? styles.structuredPositive : styles.structuredNegative}`}>
      <div className={styles.structuredListHeader}>
        <h3>{label}</h3>
        <button type="button" onClick={add}>+ Add {label.slice(0, -1).toLowerCase()}</button>
      </div>
      <div className={styles.structuredRows}>
        {rows.map((row, index) => (
          <div className={styles.structuredTextRow} key={row.id}>
            <span aria-hidden="true">{index + 1}</span>
            <textarea name={name} rows={2} maxLength={500} value={row.value} onChange={(event) => setRows((current) => current.map((item) => item.id === row.id ? { ...item, value: event.target.value } : item))} placeholder={name === 'pros' ? 'Explain one clear advantage...' : 'Explain one important limitation...'} aria-label={`${label} item ${index + 1}`} />
            <button type="button" onClick={() => remove(row.id)} aria-label={`Remove ${label.toLowerCase()} item ${index + 1}`}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ToolStructuredContentFields({ pros = [], cons = [] }: { pros?: string[]; cons?: string[] }) {
  return (
    <section className={`${styles.formCard} ${styles.structuredCard}`}>
      <div className={styles.structuredHeading}>
        <h2>Pros &amp; Cons</h2>
      </div>
      <div className={styles.proConEditor}>
        <TextList label="Pros" name="pros" tone="positive" initialValues={pros} />
        <TextList label="Cons" name="cons" tone="negative" initialValues={cons} />
      </div>
    </section>
  );
}
