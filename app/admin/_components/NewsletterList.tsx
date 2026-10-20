"use client";

import DeleteButton from "./DeleteButton";

interface NewsletterListProps {
  subscribers: { id: string; email: string; createdAt: Date | string }[];
}

const NewsletterList = ({ subscribers }: NewsletterListProps) => {
  const fmtDate = (value: Date | string) =>
    new Date(value).toLocaleDateString("en-GB", { dateStyle: "medium" });

  // Shared with the mobile card list below so the two views cannot drift.
  const actions = (s: { id: string; email: string }) => (
    <DeleteButton
      url={`/api/admin/newsletter/${s.id}`}
      confirmText={`Delete "${s.email}"? This cannot be undone.`}
      iconOnly
    />
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Subscriber list</h1>
        <p className="mt-1 text-sm text-slate-500">
          {subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}{" "}
          from the site footer signup form
        </p>
      </div>

      {/* ---------- md and up: table ---------- */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-130 text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Subscribed</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subscribers.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{s.email}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {fmtDate(s.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">{actions(s)}</div>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- below md: one card per subscriber ---------- */}
      <ul className="space-y-3 md:hidden">
        {subscribers.map((s) => (
          <li key={s.id} className="rounded-xl bg-white p-4 shadow-sm">
            <p className="min-w-0 truncate font-medium text-slate-900">{s.email}</p>
            <p className="mt-0.5 truncate text-xs text-slate-400">
              Subscribed {fmtDate(s.createdAt)}
            </p>
            <div className="mt-3">{actions(s)}</div>
          </li>
        ))}

        {subscribers.length === 0 && (
          <li className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            No subscribers yet.
          </li>
        )}
      </ul>
    </div>
  );
};

export default NewsletterList;
