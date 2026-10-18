"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { UserView } from "@/lib/types";
import { apiPost, apiPut } from "./api";
import { inputCls, labelCls, submitCls } from "./inputs";

interface UserFormProps {
  user?: UserView;
  onSuccess?: () => void;
}

const UserForm = ({ user, onSuccess }: UserFormProps) => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
  });
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (user) {
        await apiPut(`/api/admin/users/${user.id}`, form);
        toast.success("Admin account updated");
      } else {
        await apiPost("/api/admin/users", form);
        toast.success("Admin account created");
      }
      onSuccess?.();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Name *</label>
        <input
          className={inputCls}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Mahabub Hossain"
          required
        />
      </div>
      <div>
        <label className={labelCls}>Email *</label>
        <input
          type="email"
          className={inputCls}
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="name@example.com"
          required
        />
      </div>
      <div>
        <label className={labelCls}>
          Password {user ? "(leave blank to keep current)" : "*"}
        </label>
        <input
          type="password"
          className={inputCls}
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          placeholder={user ? "••••••••" : "Min 8 characters"}
          required={!user}
          minLength={user ? 0 : 8}
          autoComplete="new-password"
        />
      </div>
      <button type="submit" disabled={busy} className={submitCls}>
        {busy ? "Saving…" : user ? "Update account" : "Create account"}
      </button>
    </form>
  );
};

export default UserForm;
