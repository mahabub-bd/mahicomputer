"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCheck, Clock, Mail, MailOpen, MessageSquare, Phone, Trash2 } from "lucide-react";
import type { ContactMessage } from "@/lib/types";
import { apiDelete, apiPatch } from "./api";

interface MessagesListProps {
  messages: ContactMessage[];
}

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";

const MessagesList = ({ messages }: MessagesListProps) => {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  const markRead = async (message: ContactMessage) => {
    setBusyId(message.id);
    try {
      await apiPatch(`/api/admin/messages/${message.id}`, { read: !message.read });
      toast.success(message.read ? "Marked as unread" : "Marked as read");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (message: ContactMessage) => {
    if (!window.confirm("Delete this message?")) return;
    setBusyId(message.id);
    try {
      await apiDelete(`/api/admin/messages/${message.id}`);
      toast.success("Message deleted");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  if (messages.length === 0) {
    return <p className="text-sm text-slate-500">No messages yet.</p>;
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`rounded-xl border p-4 shadow-sm ${
            m.read ? "border-slate-200 bg-white" : "border-blue-200 bg-blue-50/50"
          } ${!m.read ? "ring-1 ring-blue-300" : ""}`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Left — 2 lines of info */}
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                {initials(m.name)}
              </span>

              <div className="min-w-0 flex-1">
                {/* Line 1 — name · badges · date */}
                <div className="flex flex-wrap items-center gap-2">
                  <p className="min-w-0 break-words text-[15px] font-semibold text-slate-900">
                    {m.name}
                  </p>
                  {!m.read && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                      New
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={12} />
                    {new Date(m.createdAt).toLocaleString("en-GB", {
                      timeStyle: "short",
                      dateStyle: "short",
                    })}
                  </span>
                </div>

                {/* Line 2 — email · phone (with gap) */}
                <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  {m.email && (
                    <p className="flex min-w-0 items-center gap-1 truncate text-slate-500">
                      <Mail size={13} className="shrink-0 text-slate-400" />
                      <span className="min-w-0 truncate">{m.email}</span>
                    </p>
                  )}
                  <p className="flex shrink-0 items-center gap-1 text-slate-500">
                    <Phone size={13} className="shrink-0 text-slate-400" />
                    {m.phone}
                  </p>
                </div>

                {/* Line 3 — message body */}
                <p className="mt-1.5 flex items-start gap-1 whitespace-pre-wrap text-sm text-slate-700">
                  <MessageSquare size={13} className="mt-1 shrink-0 text-slate-400" />
                  <span className="min-w-0 break-words">{m.message}</span>
                </p>
              </div>
            </div>

            {/* Right — actions in a single line */}
            <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
              <button
                onClick={() => markRead(m)}
                disabled={busyId === m.id}
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:opacity-50"
              >
                {m.read ? <MailOpen size={15} /> : <CheckCheck size={15} />}
                Mark as {m.read ? "unread" : "read"}
              </button>
              <button
                onClick={() => remove(m)}
                disabled={busyId === m.id}
                title="Delete"
                className="flex items-center justify-center rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesList;

