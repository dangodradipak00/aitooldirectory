'use client';

import { useState } from 'react';
import styles from '../../admin.module.css';

const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

export default function SeoFields({ initialTitle = '', initialDescription = '' }: { initialTitle?: string | null; initialDescription?: string | null }) {
  const [title, setTitle] = useState(initialTitle || '');
  const [description, setDescription] = useState(initialDescription || '');

  return (
    <section className={styles.formCard}>
      <h2>SEO</h2>
      <label>
        <span className={styles.fieldLabelRow}>
          <span>SEO title</span>
          <span className={styles.characterCount} aria-live="polite">{title.length}/{TITLE_LIMIT}</span>
        </span>
        <input
          name="seoTitle"
          maxLength={TITLE_LIMIT}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <label>
        <span className={styles.fieldLabelRow}>
          <span>SEO description</span>
          <span className={styles.characterCount} aria-live="polite">{description.length}/{DESCRIPTION_LIMIT}</span>
        </span>
        <textarea
          name="seoDescription"
          rows={5}
          maxLength={DESCRIPTION_LIMIT}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>
    </section>
  );
}
