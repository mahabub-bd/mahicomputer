import SectionHeading from "./SectionHeading";

export type RecentMessage = {
  id: string;
  name: string;
  message: string;
  read: boolean;
  createdAt: Date | string;
};

/**
 * Latest contact messages, with the unread count shown as a badge.
 *
 * The list is capped in height and scrolls inside its own card so a busy
 * inbox never stretches the dashboard.
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
        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-normal text-white">
          {unreadCount} new
        </span>
      )}
    </SectionHeading>
    {messages.length === 0 ? (
      <p className="rounded-2xl border border-slate-200/80 bg-white p-4 text-sm text-slate-500 shadow-sm">
        No messages yet.
      </p>
    ) : (
      <ul className="admin-table-scroll max-h-[22rem] divide-y divide-slate-100 overflow-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm sm:max-h-[24rem]">
        {messages.map((m) => (
          <li
            key={m.id}
            className="flex items-start justify-between gap-4 p-4 transition hover:bg-slate-50"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900">
                {m.name}
                {!m.read && (
                  <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-[11px] text-white">
                    New
                  </span>
                )}
              </p>
              <p className="truncate text-xs text-slate-500">{m.message}</p>
            </div>
            <p className="shrink-0 text-xs text-slate-400">
              {new Date(m.createdAt).toLocaleDateString("en-GB")}
            </p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default RecentMessages;
