"use client";

import { useRef, useState } from "react";
import { ImageUp, Link2, Trash2 } from "lucide-react";
import { apiUpload } from "./api";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
}

const ImageUpload = ({ value, onChange, label }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { url } = await apiUpload("/api/admin/upload", formData);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Preview — large placeholder; clicking (overlay included) opens the picker */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          title={busy ? "Uploading…" : value ? "Change image" : "Upload image"}
          className="group relative flex h-44 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-inset ring-slate-200 transition hover:ring-blue-300 disabled:opacity-60 sm:h-36 sm:w-48"
        >
          {value ? (
            // object-contain: the whole photo stays visible, never cropped.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="preview"
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <span className="flex flex-col items-center gap-1.5">
              <ImageUp size={22} className="text-slate-300" />
              <span className="text-xs text-slate-400">No image yet</span>
            </span>
          )}

          {/* In-preview label — hover on desktop, always visible before upload */}
          <span
            className={`pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-slate-900/60 py-2 text-xs font-medium text-white transition ${
              !value ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            } ${busy ? "opacity-100" : ""}`}
          >
            <ImageUp size={13} />
            {busy ? "Uploading…" : value ? "Change image" : "Upload image"}
          </span>
        </button>

        {/* Controls */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={busy}
              className="flex w-fit items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-50 disabled:opacity-50"
            >
              <Trash2 size={15} />
              Remove image
            </button>
          )}

          <div className="relative max-w-xs">
            <Link2
              size={14}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/images/... or /uploads/..."
              className="w-full truncate rounded-lg border border-slate-300 py-2 pl-8 pr-3 text-sm placeholder:text-slate-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <p className="text-xs text-slate-400">
            Click the preview to pick a file. (png, jpg, webp, svg — max 4 MB)
          </p>
          {error && <p className="text-xs text-rose-600">{error}</p>}

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onPick(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
