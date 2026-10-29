"use client";

import { btnIcon } from "@/components/form/buttonStyles";
import type { ContactMessage } from "@/lib/types";
import { CheckCheck, Clock, Mail, MailOpen, MessageSquare, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { apiPatch } from "./api";
import DeleteButton from "./DeleteButton";
import EmptyState from "./EmptyState";
import ListCard from "./ListCard";

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

const receivedLabel = (date: Date) =>
  new Date(date).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" });

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

  // Shared by the md+ table and the phone cards so the two views can never
  // drift apart.
  const Avatar = ({ message, size }: { message: ContactMessage; size: string }) => (
    <span
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700`}
    >
      {initials(message.name)}
    </span>
  );

  const newPill = (
    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
      New
    </span>
  );

  // Icon-only actions keep the row compact — labels live in tooltips.
  const actions = (message: ContactMessage) => (
    <div className="flex flex-wrap gap-1">
      <button
        onClick={() => markRead(message)}
        disabled={busyId === message.id}
        title={message.read ? "Mark as unread" : "Mark as read"}
        aria-label={message.read ? "Mark as unread" : "Mark as read"}
        className={btnIcon("secondary")}
      >
        {message.read ? <MailOpen size={15} /> : <CheckCheck size={15} />}
      </button>
      <DeleteButton
        url={`/api/admin/messages/${message.id}`}
        confirmText={`Delete the message from "${message.name}"? This cannot be undone.`}
        iconOnly
      />
    </div>
  );

  if (messages.length === 0) {
    return <EmptyState icon={Mail} title="No messages yet." />;
  }

  return (
    <div>
      {/* ---------- md and up: table ----------
          min-w + the thin scrollbar keep the columns readable — they scroll
          inside the card instead of squeezing on tablet. */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-3xl text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {messages.map((m) => (
              <tr
                key={m.id}
                className={m.read ? "hover:bg-slate-50" : "bg-blue-50/40 hover:bg-blue-50"}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar message={m} size="h-9 w-9" />
                    <div className="flex min-w-0 items-center gap-1.5">
                      <p className="truncate font-medium text-slate-900">{m.name}</p>
                      {!m.read && newPill}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="flex max-w-45 items-center gap-1 text-slate-600">
                    <Mail size={12} className="shrink-0 text-slate-400" />
                    <span className="truncate">{m.email || "—"}</span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                    <Phone size={12} className="shrink-0" />
                    {m.phone}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p
                    title={m.message}
                    className="line-clamp-2 max-w-lg text-slate-600 whitespace-pre-wrap"
                  >
                    {m.message}
                  </p>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                  {receivedLabel(m.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">{actions(m)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- below md: one card per message ----------
          A five-column table is unusable at phone widths, so each row
          becomes a stacked card: avatar + name, the New pill, the message
          body, then a compact phone / received grid and the action row. */}
      <ul className="space-y-3 md:hidden">
        {messages.map((m) => (
          <ListCard
            key={m.id}
            title={m.name}
            subtitle={m.email || m.phone}
            media={<Avatar message={m} size="h-10 w-10" />}
            badges={!m.read ? newPill : undefined}
            body={
              <p className="flex items-start gap-1 text-sm text-slate-700">
                <MessageSquare size={13} className="mt-1 shrink-0 text-slate-400" />
                <span className="min-w-0 wrap-break-word whitespace-pre-wrap">{m.message}</span>
              </p>
            }
            fields={[
              { label: "Phone", value: m.phone },
              {
                label: "Received",
                value: (
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} className="shrink-0 text-slate-400" />
                    {receivedLabel(m.createdAt)}
                  </span>
                ),
              },
              { label: "Email", value: m.email || "—", wide: true },
            ]}
            actions={actions(m)}
          />
        ))}
      </ul>
    </div>
  );
};

export default MessagesList;
