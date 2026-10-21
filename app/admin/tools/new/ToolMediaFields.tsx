'use client';

import { useEffect, useId, useRef, useState } from 'react';
import styles from '../../admin.module.css';

type CropDraft = {
  file: File;
  image: HTMLImageElement;
  objectUrl: string;
  sourceWidth: number;
  sourceHeight: number;
};

type UploadFieldProps = {
  name: string;
  removeName: string;
  title: string;
  help: string;
  initialUrl?: string;
  outputWidth: number;
  outputHeight: number;
};

function fileSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function UploadField({ name, removeName, title, help, initialUrl = '', outputWidth, outputHeight }: UploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef('');
  const [preview, setPreview] = useState(initialUrl);
  const [removed, setRemoved] = useState(false);
  const [crop, setCrop] = useState<CropDraft | null>(null);
  const [zoom, setZoom] = useState(1);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  const [result, setResult] = useState<{ width: number; height: number; size: number } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => () => {
    if (previewRef.current.startsWith('blob:')) URL.revokeObjectURL(previewRef.current);
  }, []);

  useEffect(() => {
    if (!crop || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const scale = Math.max(outputWidth / crop.sourceWidth, outputHeight / crop.sourceHeight) * zoom;
    const width = crop.sourceWidth * scale;
    const height = crop.sourceHeight * scale;
    const x = -(width - outputWidth) * (positionX / 100);
    const y = -(height - outputHeight) * (positionY / 100);
    context.clearRect(0, 0, outputWidth, outputHeight);
    context.drawImage(crop.image, x, y, width, height);
  }, [crop, outputHeight, outputWidth, positionX, positionY, zoom]);

  const closeCrop = () => {
    if (crop) URL.revokeObjectURL(crop.objectUrl);
    setCrop(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const chooseSource = (file?: File) => {
    setError('');
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/avif'].includes(file.type)) {
      setError('Choose a PNG, JPG, WEBP or AVIF image.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('The source image must be smaller than 20 MB.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setZoom(1);
      setPositionX(50);
      setPositionY(50);
      setCrop({ file, image, objectUrl, sourceWidth: image.naturalWidth, sourceHeight: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setError('This image could not be opened. Choose another file.');
      if (inputRef.current) inputRef.current.value = '';
    };
    image.src = objectUrl;
  };

  const applyCrop = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !crop || !inputRef.current) return;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.9));
    if (!blob) {
      setError('Unable to crop this image. Please try another file.');
      return;
    }
    const baseName = crop.file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9_-]+/gi, '-');
    const croppedFile = new File([blob], `${baseName || 'image'}-cropped.webp`, { type: 'image/webp' });
    const transfer = new DataTransfer();
    transfer.items.add(croppedFile);
    inputRef.current.files = transfer.files;
    if (previewRef.current.startsWith('blob:')) URL.revokeObjectURL(previewRef.current);
    const nextPreview = URL.createObjectURL(croppedFile);
    previewRef.current = nextPreview;
    setPreview(nextPreview);
    setResult({ width: outputWidth, height: outputHeight, size: croppedFile.size });
    setRemoved(false);
    URL.revokeObjectURL(crop.objectUrl);
    setCrop(null);
  };

  const removeImage = () => {
    if (previewRef.current.startsWith('blob:')) URL.revokeObjectURL(previewRef.current);
    previewRef.current = '';
    if (inputRef.current) inputRef.current.value = '';
    setPreview('');
    setResult(null);
    setRemoved(true);
    setError('');
  };

  const restoreImage = () => {
    setPreview(initialUrl);
    setRemoved(false);
    setError('');
  };

  return (
    <div className={styles.uploadField}>
      <span>{title}</span>
      <input ref={inputRef} id={inputId} name={name} type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => chooseSource(event.target.files?.[0])} />
      <input name={removeName} type="hidden" value={removed ? 'on' : ''} />
      <button className={styles.uploadDropzone} type="button" onClick={() => inputRef.current?.click()}>
        {preview ? <img src={preview} alt={`${title} preview`} /> : <i aria-hidden>↑</i>}
        <strong>{preview ? 'Change image' : 'Choose image to upload'}</strong>
        <small>{help}</small>
      </button>
      {result ? <small className={styles.uploadResult}>{result.width} × {result.height}px · {fileSize(result.size)} after crop</small> : null}
      <div className={styles.uploadActions}>
        {preview ? <button type="button" onClick={removeImage}>Remove image</button> : null}
        {!preview && removed && initialUrl ? <button type="button" onClick={restoreImage}>Keep current image</button> : null}
      </div>
      {error ? <small className={styles.fieldError} role="alert">{error}</small> : null}

      {crop ? <div className={styles.cropBackdrop} role="dialog" aria-modal="true" aria-labelledby={`${inputId}-crop-title`}>
        <div className={styles.cropDialog}>
          <div className={styles.cropHeader}><div><strong id={`${inputId}-crop-title`}>Crop {title.toLowerCase()}</strong><small>Original: {crop.sourceWidth} × {crop.sourceHeight}px · {fileSize(crop.file.size)}</small></div><button type="button" onClick={closeCrop} aria-label="Close crop editor">×</button></div>
          <div className={styles.cropCanvasWrap} style={{ aspectRatio: `${outputWidth} / ${outputHeight}` }}><canvas ref={canvasRef} /></div>
          <p className={styles.cropOutput}>Final output: <strong>{outputWidth} × {outputHeight}px</strong> · WEBP</p>
          <div className={styles.cropControls}>
            <label>Zoom <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /></label>
            <label>Horizontal position <input type="range" min="0" max="100" value={positionX} onChange={(event) => setPositionX(Number(event.target.value))} /></label>
            <label>Vertical position <input type="range" min="0" max="100" value={positionY} onChange={(event) => setPositionY(Number(event.target.value))} /></label>
          </div>
          <div className={styles.cropActions}><button type="button" onClick={closeCrop}>Cancel</button><button type="button" onClick={() => void applyCrop()}>Crop &amp; use image</button></div>
        </div>
      </div> : null}
    </div>
  );
}

export default function ToolMediaFields({ logoUrl = '', websiteImageUrl = '' }: { logoUrl?: string | null; websiteImageUrl?: string | null }) {
  return (
    <div className={styles.uploadGrid}>
      <UploadField name="logoFile" removeName="removeLogoImage" title="Tool logo" help="Square crop · 512 × 512px · Max upload 2 MB" initialUrl={logoUrl || ''} outputWidth={512} outputHeight={512} />
      <UploadField name="websiteImageFile" removeName="removeWebsiteImage" title="Tool website image" help="16:9 crop · 1200 × 675px · Max upload 5 MB" initialUrl={websiteImageUrl || ''} outputWidth={1200} outputHeight={675} />
    </div>
  );
}
