"use client";

import { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { Loader2, Paperclip, X } from "lucide-react";
import { toast } from "sonner";
import type { Notice } from "@/lib/types";
import { noticeFormSchema, type NoticeFormInput } from "@/lib/validators";
import { apiPost, apiPut, apiUpload } from "./api";
import { Checkbox, Field, Input, SubmitButton, Textarea } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

interface NoticeFormProps {
  notice?: Notice;
  onSuccess?: () => void;
}

const toDateInput = (value?: Date | string) => {
  if (!value) return new Date().toISOString().slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
};

const NoticeForm = ({ notice, onSuccess }: NoticeFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useZodForm<NoticeFormInput>(noticeFormSchema, {
    defaultValues: {
      title: notice?.title ?? "",
      body: notice?.body ?? "",
      attachmentUrl: notice?.attachmentUrl ?? "",
      attachmentName: notice?.attachmentName ?? "",
      date: toDateInput(notice?.date),
      published: notice?.published ?? true,
      order: notice?.order ?? 0,
    },
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const attachmentUrl = watch("attachmentUrl");
  const attachmentName = watch("attachmentName");

  const onPick = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { url } = await apiUpload("/api/admin/upload", formData);
      setValue("attachmentUrl", url, { shouldDirty: true });
      setValue("attachmentName", file.name, { shouldDirty: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (notice) {
        await apiPut(`/api/admin/notices/${notice.id}`, data);
        toast.success("Notice updated");
      } else {
        await apiPost("/api/admin/notices", data);
        toast.success("Notice added");
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label="Title" required error={errors.title?.message}>
        <Input
          {...register("title")}
          aria-invalid={!!errors.title}
          placeholder="ছুটির নোটিশ / Admission going on"
        />
      </Field>
      <Field label="Details" error={errors.body?.message}>
        <Textarea
          rows={5}
          {...register("body")}
          placeholder="বিস্তারিত লিখুন…"
        />
      </Field>

      {/* Attachment — uploaded immediately, URL saved with the notice */}
      <div>
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          Attachment (PDF or image, max 4 MB)
        </span>
        {attachmentUrl ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <a
              href={attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-0 items-center gap-2 text-sm text-blue-700 hover:underline"
            >
              <Paperclip size={14} className="shrink-0" />
              <span className="truncate">{attachmentName || attachmentUrl}</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setValue("attachmentUrl", "", { shouldDirty: true });
                setValue("attachmentName", "", { shouldDirty: true });
              }}
              title="Remove attachment"
              aria-label="Remove attachment"
              className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-rose-600"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Paperclip size={15} />
            )}
            {uploading ? "Uploading…" : "Attach file"}
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf,image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onPick(file);
            e.target.value = "";
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Notice date" error={errors.date?.message}>
          <Input type="date" {...register("date")} aria-invalid={!!errors.date} />
        </Field>
        <Field label="Display order" error={errors.order?.message}>
          <Input type="number" {...register("order")} />
        </Field>
      </div>
      <Controller
        control={control}
        name="published"
        render={({ field }) => (
          <Checkbox
            label="Published (visible on the site)"
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <SubmitButton busy={isSubmitting}>
        {notice ? "Update notice" : "Add notice"}
      </SubmitButton>
    </form>
  );
};

export default NoticeForm;
