"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { SiteSettingsView, StatItem } from "@/lib/types";
import { apiPut } from "./api";
import { inputCls, labelCls, submitCls } from "./inputs";

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
    key: keyof Omit<SiteSettingsView, "stats">,
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
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Hero section
        </legend>
        {text("heroTitle", "Hero title")}
        {text("heroSubtitle", "Hero subtitle", true)}
        {text("heroNote", "Hero note (e.g. course durations line)")}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          About section
        </legend>
        {text("aboutTitle", "About title")}
        {text("aboutText", "About text", true)}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Contact info
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {text("email", "Email")}
          {text("phone", "Phone")}
          {text("address", "Address")}
        </div>
      </fieldset>

      {/* Social links are managed on the dedicated Social page (/admin/social). */}

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Stats (one glance section)
        </legend>
        {form.stats.map((stat, i) => (
          <div key={i} className="flex flex-wrap items-end gap-3">
            <div>
              <label className={labelCls}>Title</label>
              <input
                className={inputCls}
                value={stat.title}
                onChange={(e) => setStat(i, "title", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Value</label>
              <input
                className={inputCls}
                value={stat.value}
                onChange={(e) => setStat(i, "value", e.target.value)}
              />
            </div>
            <div>
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
