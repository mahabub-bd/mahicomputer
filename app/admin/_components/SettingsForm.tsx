"use client";

import { Button, Field, Input, SubmitButton, Textarea } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";
import type { SiteSettingsView } from "@/lib/types";
import { settingsFormSchema, type SettingsFormInput } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { apiPut } from "./api";
import ImageUpload from "./ImageUpload";

interface SettingsFormProps {
  settings: SiteSettingsView;
  /** Called after a successful save — used to close the edit modal. */
  onSuccess?: () => void;
}

/** New stats cycle through the four gradient tokens defined in globals.css. */
const STAT_CLASSES = ["bg-stat-1", "bg-stat-2", "bg-stat-3", "bg-stat-4"];
const emptyStat = { id: "", title: "", value: "", class: STAT_CLASSES[0] };

type TextKey = {
  [K in keyof SettingsFormInput]: SettingsFormInput[K] extends string ? K : never;
}[keyof SettingsFormInput];

const SettingsForm = ({ settings, onSuccess }: SettingsFormProps) => {
  const router = useRouter();
  // Business details (contact info, hours, map, WhatsApp) live in their own
  // BusinessSetting table and are edited from /admin/business-settings.
  const { marqueeItems, ...rest } = settings;
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useZodForm<SettingsFormInput>(settingsFormSchema, {
    defaultValues: { ...rest, marqueeText: marqueeItems.join("\n") },
  });
  const stats = useFieldArray({ control, name: "stats", keyName: "_key" });
  const features = useFieldArray({ control, name: "whyFeatures" });

  const onSubmit = handleSubmit(async (data) => {
    const { marqueeText, ...values } = data;
    const payload = {
      ...values,
      marqueeItems: marqueeText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      stats: data.stats.map((s, i) => ({
        ...s,
        id: s.id || `stats-${i + 1}`,
      })),
    };
    try {
      await apiPut("/api/admin/settings", payload);
      toast.success("Homepage settings saved");
      router.refresh();
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError("root", { message: msg });
      toast.error(msg);
    }
  });

  const text = (key: TextKey, label: string, textarea = false) => (
    <Field label={label} error={errors[key]?.message}>
      {textarea ? (
        <Textarea rows={5} {...register(key)} />
      ) : (
        <Input {...register(key)} />
      )}
    </Field>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <fieldset className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">Hero section</legend>
        <p className="mb-4 w-full border-b border-slate-200 pb-3 text-[13px] font-bold uppercase tracking-wider text-slate-700">
          Hero section
        </p>
        {text("heroTitle", "Hero title")}
        {text("heroSubtitle", "Hero subtitle", true)}
        {text("heroNote", "Hero note (e.g. course durations line)")}
        <Controller
          control={control}
          name="heroImageUrl"
          render={({ field }) => (
            <ImageUpload
              value={field.value}
              onChange={field.onChange}
              label="Hero background image (landscape, ~1920×1080px recommended)"
            />
          )}
        />
        <p className="text-xs text-slate-400">
          Leave empty to keep the default background. A dark overlay is applied automatically for
          text readability.
        </p>
      </fieldset>

      <fieldset className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">Marquee (top announcements bar)</legend>
        <p className="mb-4 w-full border-b border-slate-200 pb-3 text-[13px] font-bold uppercase tracking-wider text-slate-700">
          Marquee (top announcements bar)
        </p>
        <Field
          label="Announcements (one per line)"
          hint="Leave empty to keep the current announcements."
          error={errors.marqueeText?.message}
        >
          <Textarea
            rows={4}
            {...register("marqueeText")}
            placeholder={"বাংলাদেশ কারিগরি শিক্ষাবোর্ড কর্তৃক অনুমোদিত প্রতিষ্ঠান...\n...next announcement"}
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">Why Choose Us</legend>
        <p className="mb-4 w-full border-b border-slate-200 pb-3 text-[13px] font-bold uppercase tracking-wider text-slate-700">
          Why Choose Us
        </p>
        {text("whyTitle", "Section title")}
        {text("whySubtitle", "Section subtitle")}
        {features.fields.map((feat, i) => (
          <div key={feat.id} className="flex flex-wrap items-end gap-3">
            <Field
              label="Feature title"
              className="min-w-50 flex-1"
              error={errors.whyFeatures?.[i]?.title?.message}
            >
              <Input {...register(`whyFeatures.${i}.title`)} />
            </Field>
            <Field
              label="Feature text"
              className="min-w-70 flex-2"
              error={errors.whyFeatures?.[i]?.text?.message}
            >
              <Input {...register(`whyFeatures.${i}.text`)} />
            </Field>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => features.remove(i)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => features.append({ title: "", text: "" })}
        >
          + Add feature
        </Button>
        <p className="text-xs text-slate-400">
          Icons are assigned automatically (in order). Leave everything empty to keep the current
          section content.
        </p>
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">Course detail page</legend>
        <p className="mb-4 w-full border-b border-slate-200 pb-3 text-[13px] font-bold uppercase tracking-wider text-slate-700">
          Course detail page
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {text("courseAboutTitle", "About section heading")}
          {text("courseInsideTitle", "Modules section heading")}
        </div>
        <p className="text-xs text-slate-400">
          Leave empty to keep the defaults (&quot;About This Course&quot; / &quot;Inside This Course&quot;).
        </p>
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">About section</legend>
        <p className="mb-4 w-full border-b border-slate-200 pb-3 text-[13px] font-bold uppercase tracking-wider text-slate-700">
          About section
        </p>
        {text("aboutTitle", "About title")}
        {text("aboutText", "About text", true)}
        <Controller
          control={control}
          name="aboutImageUrl"
          render={({ field }) => (
            <ImageUpload
              value={field.value}
              onChange={field.onChange}
              label="About image (shown beside the About text)"
            />
          )}
        />
        <p className="text-xs text-slate-400">
          Leave empty to keep the default image. Recommended: landscape, ~1200×900px.
        </p>
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">CEO section</legend>
        <p className="mb-4 w-full border-b border-slate-200 pb-3 text-[13px] font-bold uppercase tracking-wider text-slate-700">
          CEO section
        </p>
        {text("ceoTitle", "CEO section title")}
        {text("ceoText", "CEO message (blank line = new paragraph)", true)}
        <Controller
          control={control}
          name="ceoImageUrl"
          render={({ field }) => (
            <ImageUpload
              value={field.value}
              onChange={field.onChange}
              label="CEO & Founder image (shown beside the CEO message)"
            />
          )}
        />
        <p className="text-xs text-slate-400">
          Leave empty to keep the default image. Recommended: portrait, ~900×1100px.
        </p>
      </fieldset>

      {/* Contact info (phone/email/address) and WhatsApp live in the
          dedicated Business settings page (/admin/business-settings). */}

      <fieldset className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">Stats (one glance section)</legend>
        <p className="mb-4 w-full border-b border-slate-200 pb-3 text-[13px] font-bold uppercase tracking-wider text-slate-700">
          Stats (one glance section)
        </p>
        {/* The tile background is not editable: existing stats keep the class
            they were saved with, new ones take the next gradient in rotation. */}
        {stats.fields.map((stat, i) => (
          <div key={stat._key} className="flex flex-wrap items-end gap-3">
            <Field
              label="Title"
              className="min-w-50 flex-2"
              error={errors.stats?.[i]?.title?.message}
            >
              <Input {...register(`stats.${i}.title`)} />
            </Field>
            <Field
              label="Value"
              className="min-w-32.5 flex-1"
              error={errors.stats?.[i]?.value?.message}
            >
              <Input {...register(`stats.${i}.value`)} />
            </Field>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => stats.remove(i)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            stats.append({
              ...emptyStat,
              class: STAT_CLASSES[stats.fields.length % STAT_CLASSES.length],
            })
          }
        >
          + Add stat
        </Button>
      </fieldset>

      {errors.root?.message && (
        <p className="text-sm text-rose-600">{errors.root.message}</p>
      )}
      <div className="flex items-center gap-3">
        <SubmitButton busy={isSubmitting}>Save homepage settings</SubmitButton>
      </div>
    </form>
  );
};

export default SettingsForm;
