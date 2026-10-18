import SectionHeading from "./SectionHeading";

export type RecentMessage = {
  id: string;
  name: string;
  message: string;
  read: boolean;
  createdAt: Date | string;
};

/** Latest contact messages, with the unread count shown as a badge. */
const RecentMessages = ({
  messages,
  unreadCount,
}: {
  messages: RecentMessage[];
  unreadCount: number;
}) => (
  <div>
    <SectionHeading title="Recent messages" href="/admin/messages" action="View all">
      {unreadCount > 0 && (
        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-normal text-white">
          {unreadCount} new
        </span>
      )}
    </SectionHeading>
    {messages.length === 0 ? (
      <p className="rounded-xl bg-white p-4 text-sm text-slate-500 shadow-sm">
        No messages yet.
      </p>
    ) : (
      <div className="divide-y divide-slate-100 rounded-xl bg-white shadow-sm">
        {messages.map((m) => (
          <div key={m.id} className="flex items-center justify-between gap-4 p-4">
            <div className="flex min-w-0 flex-col gap-1.5">
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
          </div>
        ))}
      </div>
    )}
  </div>
);

export default RecentMessages;
