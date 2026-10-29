"use client";

import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import type { BusinessSettingsView } from "@/lib/types";
import { businessSettingSchema, type BusinessSettingInput } from "@/lib/validators";
import { apiPut } from "./api";
import { Checkbox, Field, Input, SubmitButton, Textarea } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

interface BusinessSettingsFormProps {
  settings: BusinessSettingsView;
  /** Called after a successful save — used to close the edit modal. */
  onSuccess?: () => void;
}

/**
 * Focused admin module for business details: business name, opening hours
 * and the WhatsApp chat widget. Backed by its own `BusinessSetting` table —
 * fully independent of the homepage settings page.
 */
const BusinessSettingsForm = ({ settings, onSuccess }: BusinessSettingsFormProps) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useZodForm<BusinessSettingInput>(businessSettingSchema, {
    defaultValues: settings,
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await apiPut("/api/admin/business-settings", data);
      toast.success("Business settings saved");
      router.refresh();
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError("root", { message: msg });
      toast.error(msg);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <fieldset className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">Business identity</legend>
        <p className="mb-4 w-full border-b border-slate-200 pb-3 text-[13px] font-bold uppercase tracking-wider text-slate-700">
          Business identity
        </p>
        <Field
          label="Business name"
          hint="Shown in the footer copyright and the WhatsApp chat header. Falls back to “Mahi Computer” when empty."
          error={errors.businessName?.message}
        >
          <Input {...register("businessName")} placeholder="Mahi Computer" />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Phone" error={errors.phone?.message}>
            <Input {...register("phone")} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input {...register("email")} />
          </Field>
        </div>
        {/* Full width — the address is the longest value in this section. */}
        <Field label="Address" error={errors.address?.message}>
          <Input {...register("address")} />
        </Field>
        <Field
          label="Opening hours"
          hint="One short line, shown with a clock icon in the footer contact list."
          error={errors.openingHours?.message}
        >
          <Input {...register("openingHours")} placeholder="শনি–বৃহস্পতি: সকাল ৯টা – রাত ৯টা" />
        </Field>
        <Field
          label="Google Maps embed URL (src of the iframe)"
          error={errors.mapEmbedUrl?.message}
        >
          <Input {...register("mapEmbedUrl")} placeholder="https://www.google.com/maps/embed?pb=..." />
        </Field>
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">WhatsApp chat</legend>
        <p className="mb-4 w-full border-b border-slate-200 pb-3 text-[13px] font-bold uppercase tracking-wider text-slate-700">
          WhatsApp chat
        </p>
        <Controller
          control={control}
          name="whatsappEnabled"
          render={({ field }) => (
            <Checkbox
              label="Show the floating WhatsApp chat widget on the public site"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />
        <Field
          label="WhatsApp number"
          hint="International format, digits only — e.g. 8801712345678 (no +, no spaces). Leave empty to hide WhatsApp everywhere."
          error={errors.whatsappNumber?.message}
        >
          <Input {...register("whatsappNumber")} inputMode="numeric" placeholder="8801XXXXXXXXX" />
        </Field>
        <Field
          label="Preset chat message"
          hint="Pre-fills the visitor's first message when they open WhatsApp."
          error={errors.whatsappMessage?.message}
        >
          <Textarea
            rows={3}
            {...register("whatsappMessage")}
            placeholder="আসসালামু আলাইকুম! আমি কোর্স সম্পর্কে জানতে চাই।"
          />
        </Field>
        <p className="text-xs text-slate-400">
          The widget appears bottom-right on every public page. The number is also added as a
          WhatsApp row in the footer contact list.
        </p>
      </fieldset>

      {errors.root?.message && (
        <p className="text-sm text-rose-600">{errors.root.message}</p>
      )}
      <div className="flex items-center gap-3">
        <SubmitButton busy={isSubmitting}>Save business settings</SubmitButton>
      </div>
    </form>
  );
};

export default BusinessSettingsForm;
