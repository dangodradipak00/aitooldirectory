'use client';

import { useEffect, useRef, useState } from 'react';
import { useAdminFormState } from '../AdminForm';
import styles from '../admin.module.css';

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

export function BlogBasicsFields({ title = '', slug = '' }: { title?: string; slug?: string }) {
  const formState = useAdminFormState();
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [slugEdited, setSlugEdited] = useState(Boolean(slug));

  return <>
    <div className={styles.fieldRow}>
      <label>Article title *<input name="title" required minLength={4} maxLength={180} value={currentTitle} onChange={(event) => {
        const value = event.target.value;
        setCurrentTitle(value);
        if (!slugEdited) setCurrentSlug(toSlug(value));
      }} /></label>
      <label>Slug *<input name="slug" required minLength={2} maxLength={100} value={currentSlug} aria-invalid={Boolean(formState?.fieldErrors?.slug)} aria-describedby={formState?.fieldErrors?.slug ? 'blog-slug-error' : undefined} onChange={(event) => {
        setSlugEdited(true);
        setCurrentSlug(toSlug(event.target.value));
      }} placeholder="article-title" />{formState?.fieldErrors?.slug ? <small id="blog-slug-error" className={styles.fieldError} role="alert">{formState.fieldErrors.slug}</small> : null}</label>
    </div>
  </>;
}

export function BlogCoverField({ initialUrl = '' }: { initialUrl?: string | null }) {
  const [preview, setPreview] = useState(initialUrl || '');
  const previewRef = useRef('');

  useEffect(() => () => {
    if (previewRef.current.startsWith('blob:')) URL.revokeObjectURL(previewRef.current);
  }, []);

  const chooseFile = (file?: File) => {
    if (previewRef.current.startsWith('blob:')) URL.revokeObjectURL(previewRef.current);
    const next = file ? URL.createObjectURL(file) : initialUrl || '';
    previewRef.current = next;
    setPreview(next);
  };

  return <>
    <label className={styles.blogCoverField}>
      <span>Cover image</span>
      <input name="coverImageFile" type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => chooseFile(event.target.files?.[0])} />
      <span className={styles.blogCoverDropzone}>
        {preview ? <img src={preview} alt="Blog cover preview" /> : <span className={styles.blogCoverEmpty}><i aria-hidden>↑</i><strong>Choose a cover image</strong><small>PNG, JPG, WEBP or AVIF · Max 5 MB</small></span>}
      </span>
    </label>
    {initialUrl ? <label className={styles.inlineCheck}><input name="removeCoverImage" type="checkbox" /> Remove the existing cover image</label> : null}
  </>;
}
