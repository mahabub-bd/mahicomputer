"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import type { Post } from "@/lib/types";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import BlogForm from "./BlogForm";

interface BlogsListProps {
  posts: (Post & { publishedBy: { name: string } | null })[];
}

const BlogsList = ({ posts }: BlogsListProps) => {
  const [modal, setModal] = useState<{ post?: Post } | null>(null);

  const fmtDate = (value: Date | string) =>
    new Date(value).toLocaleDateString("en-GB", { dateStyle: "medium" });

  // Shared with the mobile card list below so the two views cannot drift.
  const statusPill = (published: boolean) =>
    published ? (
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
        Published
      </span>
    ) : (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
        Hidden
      </span>
    );

  const actions = (n: Post) => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setModal({ post: n })}
        title="Edit"
        className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
      >
        <Pencil size={15} />
        Edit
      </button>
      <DeleteButton
        url={`/api/admin/blogs/${n.id}`}
        confirmText={`Delete "${n.title}"? This cannot be undone.`}
      />
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Blogs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Blog posts shown on the site /blogs page
          </p>
        </div>
        <button
          onClick={() => setModal({})}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 sm:w-auto"
        >
          <Plus size={16} />
          Add blog
        </button>
      </div>

      {/* ---------- md and up: table ---------- */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Cover</th>
              <th className="px-4 py-3">Title / excerpt</th>
              <th className="px-4 py-3">Published by</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((n) => (
              <tr key={n.id} className="hover:bg-slate-50 align-top">
                <td className="px-4 py-3">
                  {n.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={n.imageUrl}
                      alt=""
                      className="h-10 w-16 rounded object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-16 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">
                      —
                    </span>
                  )}
                </td>
                <td className="max-w-105 px-4 py-3">
                  <p className="font-medium text-slate-900">{n.title}</p>
                  {n.excerpt && (
                    <p className="mt-0.5 line-clamp-2 text-slate-500">{n.excerpt}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">{n.publishedBy?.name || "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {fmtDate(n.createdAt)}
                </td>
                <td className="px-4 py-3">{statusPill(n.published)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">{actions(n)}</div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No blogs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- below md: one card per post ---------- */}
      <ul className="space-y-3 md:hidden">
        {posts.map((n) => (
          <li key={n.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              {n.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={n.imageUrl}
                  alt=""
                  className="h-14 w-24 shrink-0 rounded object-cover"
                />
              ) : (
                <span className="flex h-14 w-24 shrink-0 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">
                  —
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 flex-1 truncate font-medium text-slate-900">
                    {n.title}
                  </p>
                  <span className="shrink-0">{statusPill(n.published)}</span>
                </div>
                {n.excerpt && (
                  <p className="mt-0.5 truncate text-xs text-slate-400">{n.excerpt}</p>
                )}
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Published by
                </dt>
                <dd className="mt-0.5 truncate text-sm font-medium text-slate-700">
                  {n.publishedBy?.name || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Date
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-700">
                  {fmtDate(n.createdAt)}
                </dd>
              </div>
            </dl>

            <div className="mt-3">{actions(n)}</div>
          </li>
        ))}

        {posts.length === 0 && (
          <li className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            No blogs yet.
          </li>
        )}
      </ul>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.post ? `Edit: ${modal.post.title}` : "Add blog"}
        wide
      >
        {modal !== null && (
          <BlogForm
            key={modal.post?.id ?? "new"}
            post={modal.post}
            onSuccess={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default BlogsList;
