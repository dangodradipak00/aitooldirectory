'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '../../admin.module.css';

function UploadField({ name, title, help, required = false, initialUrl = '' }: { name: string; title: string; help: string; required?: boolean; initialUrl?: string }) {
  const [preview, setPreview] = useState(initialUrl);
  const previewRef = useRef('');

  useEffect(() => () => {
    if (previewRef.current.startsWith('blob:')) URL.revokeObjectURL(previewRef.current);
  }, []);

  const chooseFile = (file?: File) => {
    if (previewRef.current.startsWith('blob:')) URL.revokeObjectURL(previewRef.current);
    const next = file ? URL.createObjectURL(file) : '';
    previewRef.current = next;
    setPreview(next);
  };

  return (
    <label className={styles.uploadField}>
      <span>{title}{required ? ' *' : ''}</span>
      <input name={name} type="file" accept="image/png,image/jpeg,image/webp,image/avif" required={required} onChange={(event) => chooseFile(event.target.files?.[0])} />
      <span className={styles.uploadDropzone}>
        {preview ? <img src={preview} alt="Selected file preview" /> : <i aria-hidden>↑</i>}
        <strong>{preview ? 'Change image' : 'Choose image to upload'}</strong>
        <small>{help}</small>
      </span>
    </label>
  );
}

export default function ToolMediaFields({ logoUrl = '', websiteImageUrl = '' }: { logoUrl?: string | null; websiteImageUrl?: string | null }) {
  return (
    <div className={styles.uploadGrid}>
      <UploadField name="logoFile" title="Tool logo" help="PNG, JPG, WEBP or AVIF · Max 2 MB" initialUrl={logoUrl || ''} />
      <UploadField name="websiteImageFile" title="Tool website image" help="PNG, JPG, WEBP or AVIF · Max 5 MB" initialUrl={websiteImageUrl || ''} />
    </div>
  );
}
