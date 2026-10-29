import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { formatDate } from "@/lib/format";
import SectionHeading from "./SectionHeading";

export type RecentMessage = {
  id: string;
  name: string;
  message: string;
  read: boolean;
  createdAt: Date | string;
};

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase() || "?";

/** Inbox-friendly age: "Just now" → "35m ago" → "5h ago" → "Yesterday" → date. */
const receivedLabel = (value: Date | string) => {
  const date = new Date(value);
  const minutes = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(date);
};

/**
 * Latest contact messages with the unread count as a heading badge.
 *
 * Unread rows are tinted and get a blue dot instead of a "New" pill, so the
 * eye lands on the ones that still need a reply. The list is short enough to
 * show in full — no inner scrollbar.
 */
const RecentMessages = ({
  messages,
  unreadCount,
}: {
  messages: RecentMessage[];
  unreadCount: number;
}) => (
  <div className="min-w-0">
    <SectionHeading title="Recent messages" href="/admin/messages" action="View all">
      {unreadCount > 0 && (
        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white">
          {unreadCount} new
        </span>
      )}
    </SectionHeading>

    {messages.length === 0 ? (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-6 py-10 text-center shadow-sm">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <Inbox size={20} aria-hidden />
        </span>
        <p className="text-sm font-medium text-slate-700">No messages yet</p>
        <p className="text-xs text-slate-400">
          Contact form submissions from the site land here.
        </p>
        <Link
          href="/admin/messages"
          className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
        >
          Open inbox
          <ArrowRight size={13} aria-hidden />
        </Link>
      </div>
    ) : (
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        {messages.map((message) => {
          const unread = !message.read;
          return (
            <li
              key={message.id}
              className={`flex items-start gap-3 px-4 py-3 ${unread ? "bg-blue-50/40" : ""}`}
            >
              <span
                aria-hidden
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ring-1 ${
                  unread
                    ? "bg-blue-100 text-blue-700 ring-blue-200"
                    : "bg-slate-100 text-slate-500 ring-slate-200"
                }`}
              >
                {initials(message.name)}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`truncate text-sm ${
                      unread ? "font-semibold text-slate-900" : "font-medium text-slate-700"
                    }`}
                  >
                    {message.name}
                  </p>
                  {unread && (
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                      title="Unread"
                    />
                  )}
                  <time
                    dateTime={new Date(message.createdAt).toISOString()}
                    className="ml-auto shrink-0 text-[11px] text-slate-400"
                  >
                    {receivedLabel(message.createdAt)}
                  </time>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed whitespace-pre-wrap text-slate-500">
                  {message.message}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

export default RecentMessages;
