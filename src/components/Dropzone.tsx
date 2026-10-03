import { useCallback, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface DropzoneFile {
  file: File;
  id: string;
  previewUrl?: string;
  status?: 'idle' | 'uploading' | 'done' | 'error';
  progress?: number;
  error?: string;
}

export interface DropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // bytes
  disabled?: boolean;
  hint?: string;
  files?: DropzoneFile[];
  onFilesChange?: (files: DropzoneFile[]) => void;
  onFiles?: (files: File[]) => void;
  children?: ReactNode;
  className?: string;
}

function createPreview(file: File): string | undefined {
  if (file.type.startsWith('image/')) {
    try {
      return URL.createObjectURL(file);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function Dropzone({
  accept,
  multiple = true,
  maxFiles = 10,
  maxSize,
  disabled = false,
  hint,
  files: controlledFiles,
  onFilesChange,
  onFiles,
  children,
  className,
}: DropzoneProps) {
  const [internalFiles, setInternalFiles] = useState<DropzoneFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const files = controlledFiles ?? internalFiles;

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const arr = Array.from(incoming);
      if (arr.length === 0) return;

      // Validate count
      if (files.length + arr.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} files`);
        return;
      }

      const next: DropzoneFile[] = [];
      for (const file of arr) {
        if (maxSize && file.size > maxSize) {
          setError(`${file.name} is too large (max ${formatBytes(maxSize)})`);
          continue;
        }
        next.push({
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          file,
          previewUrl: createPreview(file),
          status: 'idle',
          progress: 0,
        });
      }

      if (next.length === 0) return;
      setError(null);

      const merged = [...files, ...next];
      if (controlledFiles === undefined) setInternalFiles(merged);
      onFilesChange?.(merged);
      onFiles?.(next.map((f) => f.file));

      // Simulate upload progress for premium feel
      next.forEach((item) => {
        let p = 0;
        const iv = setInterval(() => {
          p += Math.random() * 18 + 6;
          if (p >= 100) {
            p = 100;
            clearInterval(iv);
          }
          const nextStatus: DropzoneFile['status'] = p === 100 ? 'done' : 'uploading';
          const updater = (prev: DropzoneFile[]) =>
            prev.map((f) => (f.id === item.id ? { ...f, progress: p, status: nextStatus } : f));
          if (controlledFiles === undefined) {
            setInternalFiles(updater);
          }
        }, 120);
      });
    },
    [files, maxFiles, maxSize, controlledFiles, onFilesChange, onFiles]
  );

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      setDragOver(false);
      if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
    },
    [addFiles, disabled]
  );

  const onDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) setDragOver(true);
    },
    [disabled]
  );

  const onDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const openPicker = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const removeFile = useCallback(
    (id: string) => {
      const f = files.find((x) => x.id === id);
      if (f?.previewUrl) URL.revokeObjectURL(f.previewUrl);
      const next = files.filter((x) => x.id !== id);
      if (controlledFiles === undefined) setInternalFiles(next);
      onFilesChange?.(next);
      setError(null);
    },
    [files, controlledFiles, onFilesChange]
  );

  return (
    <div className={cn('pui-dropzone-root', className)}>
      <div
        className={cn(
          'pui-dropzone',
          dragOver && 'pui-dropzone--drag',
          disabled && 'pui-dropzone--disabled',
          error && 'pui-dropzone--error'
        )}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPicker();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label="Upload files"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            // reset so same file can be picked again
            e.target.value = '';
          }}
        />

        <div className="pui-dropzone__icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 16V4" />
            <path d="M8 8l4-4 4 4" />
            <path d="M4 20h16" />
            <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" opacity="0.35" />
          </svg>
        </div>

        <div className="pui-dropzone__body">
          {children ?? (
            <>
              <div className="pui-dropzone__title">
                Drop files here or <span className="pui-dropzone__action">browse</span>
              </div>
              <div className="pui-dropzone__hint">{hint ?? 'PNG, JPG, PDF up to 5MB'}</div>
            </>
          )}
        </div>

        <div className="pui-dropzone__glow" aria-hidden="true" />
      </div>

      {error && (
        <div className="pui-dropzone__error" role="alert">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="pui-dropzone__list" role="list">
          {files.map((item) => (
            <div key={item.id} className="pui-dropzone__file" role="listitem">
              <div className="pui-dropzone__file-thumb">
                {item.previewUrl ? (
                  <img src={item.previewUrl} alt="" />
                ) : (
                  <span className="pui-dropzone__file-ext">{item.file.name.split('.').pop()?.slice(0, 4).toUpperCase()}</span>
                )}
              </div>
              <div className="pui-dropzone__file-meta">
                <div className="pui-dropzone__file-name">{item.file.name}</div>
                <div className="pui-dropzone__file-sub">
                  {formatBytes(item.file.size)} · {item.status === 'done' ? 'Uploaded' : item.status === 'uploading' ? `${Math.round(item.progress ?? 0)}%` : 'Queued'}
                </div>
                <div className="pui-dropzone__file-bar">
                  <div className="pui-dropzone__file-bar-fill" style={{ width: `${item.progress ?? 0}%` }} />
                </div>
              </div>
              <button type="button" className="pui-dropzone__file-remove" onClick={(e) => { e.stopPropagation(); removeFile(item.id); }} aria-label={`Remove ${item.file.name}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
