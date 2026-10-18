"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { SiteSettingsView, StatItem, WhyFeature } from "@/lib/types";
import { apiPut } from "./api";
import { inputCls, labelCls, submitCls } from "./inputs";
import ImageUpload from "./ImageUpload";

interface SettingsFormProps {
  settings: SiteSettingsView;
}

const emptyStat: StatItem = { id: "", title: "", value: "", class: "bg-stat-1" };

const SettingsForm = ({ settings }: SettingsFormProps) => {
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof SiteSettingsView>(key: K, value: SiteSettingsView[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const setStat = (index: number, key: keyof StatItem, value: string) => {
    setForm((f) => ({
      ...f,
      stats: f.stats.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
    }));
  };

  const setFeature = (index: number, key: keyof WhyFeature, value: string) => {
    setForm((f) => ({
      ...f,
      whyFeatures: f.whyFeatures.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const cleaned = {
        ...form,
        stats: form.stats.map((s, i) => ({
          ...s,
          id: s.id || `stats-${i + 1}`,
        })),
      };
      await apiPut("/api/admin/settings", cleaned);
      toast.success("Settings saved");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const text = (
    key: {
      [K in keyof SiteSettingsView]: SiteSettingsView[K] extends string ? K : never;
    }[keyof SiteSettingsView],
    label: string,
    textarea = false
  ) => (
    <div>
      <label className={labelCls}>{label}</label>
      {textarea ? (
        <textarea
          rows={5}
          className={inputCls}
          value={form[key]}
          onChange={(e) => set(key, e.target.value as never)}
        />
      ) : (
        <input
          className={inputCls}
          value={form[key]}
          onChange={(e) => set(key, e.target.value as never)}
        />
      )}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <fieldset className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">Hero section</legend>
        <p className="mb-4 w-full border-b border-slate-200 pb-3 text-[13px] font-bold uppercase tracking-wider text-slate-700">
          Hero section
        </p>
        {text("heroTitle", "Hero title")}
        {text("heroSubtitle", "Hero subtitle", true)}
        {text("heroNote", "Hero note (e.g. course durations line)")}
        <ImageUpload
          value={form.heroImageUrl}
          onChange={(url) => set("heroImageUrl", url)}
          label="Hero background image (landscape, ~1920×1080px recommended)"
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
        <div>
          <label className={labelCls}>Announcements (one per line)</label>
          <textarea
            rows={4}
            className={inputCls}
            value={form.marqueeItems.join("\n")}
            placeholder={"বাংলাদেশ কারিগরি শিক্ষাবোর্ড কর্তৃক অনুমোদিত প্রতিষ্ঠান...\n...next announcement"}
            onChange={(e) =>
              set(
                "marqueeItems",
                e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
          <p className="mt-1 text-xs text-slate-400">
            Leave empty to keep the current announcements.
          </p>
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">Why Choose Us</legend>
        <p className="mb-4 w-full border-b border-slate-200 pb-3 text-[13px] font-bold uppercase tracking-wider text-slate-700">
          Why Choose Us
        </p>
        {text("whyTitle", "Section title")}
        {text("whySubtitle", "Section subtitle")}
        {form.whyFeatures.map((feat, i) => (
          <div key={i} className="flex flex-wrap items-end gap-3">
            <div className="min-w-[200px] flex-[1]">
              <label className={labelCls}>Feature title</label>
              <input
                className={inputCls}
                value={feat.title}
                onChange={(e) => setFeature(i, "title", e.target.value)}
              />
            </div>
            <div className="min-w-[280px] flex-[2]">
              <label className={labelCls}>Feature text</label>
              <input
                className={inputCls}
                value={feat.text}
                onChange={(e) => setFeature(i, "text", e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => set("whyFeatures", form.whyFeatures.filter((_, j) => j !== i))}
              className="rounded-md border border-rose-200 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => set("whyFeatures", [...form.whyFeatures, { title: "", text: "" }])}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          + Add feature
        </button>
        <p className="text-xs text-slate-400">
          Icons are assigned automatically (in order). Leave everything empty to keep the current
          section content.
        </p>
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">Map section</legend>
        <p className="mb-4 w-full border-b border-slate-200 pb-3 text-[13px] font-bold uppercase tracking-wider text-slate-700">
          Map section
        </p>
        {text("mapEmbedUrl", "Google Maps embed URL (src of the iframe)")}
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
          Leave empty to keep the defaults ("About This Course" / "Inside This Course").
        </p>
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">About section</legend>
        <p className="mb-4 w-full border-b border-slate-200 pb-3 text-[13px] font-bold uppercase tracking-wider text-slate-700">
          About section
        </p>
        {text("aboutTitle", "About title")}
        {text("aboutText", "About text", true)}
        <ImageUpload
          value={form.aboutImageUrl}
          onChange={(url) => set("aboutImageUrl", url)}
          label="About image (shown beside the About text)"
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
        <ImageUpload
          value={form.ceoImageUrl}
          onChange={(url) => set("ceoImageUrl", url)}
          label="CEO & Founder image (shown beside the CEO message)"
        />
        <p className="text-xs text-slate-400">
          Leave empty to keep the default image. Recommended: portrait, ~900×1100px.
        </p>
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">Contact info</legend>
        <p className="mb-4 w-full border-b border-slate-200 pb-3 text-[13px] font-bold uppercase tracking-wider text-slate-700">
          Contact info
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {text("email", "Email")}
          {text("phone", "Phone")}
          {text("address", "Address")}
        </div>
      </fieldset>

      {/* Social links are managed on the dedicated Social page (/admin/social). */}

      <fieldset className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <legend className="sr-only">Stats (one glance section)</legend>
        <p className="mb-4 w-full border-b border-slate-200 pb-3 text-[13px] font-bold uppercase tracking-wider text-slate-700">
          Stats (one glance section)
        </p>
        {form.stats.map((stat, i) => (
          <div key={i} className="flex flex-wrap items-end gap-3">
            <div className="min-w-[200px] flex-[2]">
              <label className={labelCls}>Title</label>
              <input
                className={inputCls}
                value={stat.title}
                onChange={(e) => setStat(i, "title", e.target.value)}
              />
            </div>
            <div className="min-w-[130px] flex-[1]">
              <label className={labelCls}>Value</label>
              <input
                className={inputCls}
                value={stat.value}
                onChange={(e) => setStat(i, "value", e.target.value)}
              />
            </div>
            <div className="min-w-[170px] flex-[1]">
              <label className={labelCls}>BG class</label>
              <input
                className={inputCls}
                value={stat.class}
                onChange={(e) => setStat(i, "class", e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => set("stats", form.stats.filter((_, j) => j !== i))}
              className="rounded-md border border-rose-200 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => set("stats", [...form.stats, { ...emptyStat }])}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          + Add stat
        </button>
      </fieldset>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy} className={submitCls}>
          {busy ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;
