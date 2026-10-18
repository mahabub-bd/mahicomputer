"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCheck, MailOpen, Trash2 } from "lucide-react";
import type { ContactMessage } from "@/lib/types";
import { apiDelete, apiPatch } from "./api";

interface MessagesListProps {
  messages: ContactMessage[];
}

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
          className={`rounded-lg border p-4 ${
            m.read ? "border-slate-200 bg-white" : "border-blue-200 bg-blue-50/50"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium text-slate-900">
                {m.name}
                {!m.read && (
                  <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-[11px] text-white">
                    New
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-500">
                {m.email} · {m.phone} ·{" "}
                {new Date(m.createdAt).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => markRead(m)}
                disabled={busyId === m.id}
                className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
              >
                {m.read ? <MailOpen size={15} /> : <CheckCheck size={15} />}
                Mark as {m.read ? "unread" : "read"}
              </button>
              <button
                onClick={() => remove(m)}
                disabled={busyId === m.id}
                className="flex items-center gap-1.5 rounded-md border border-rose-200 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-50"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{m.message}</p>
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
