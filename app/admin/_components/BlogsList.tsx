"use client";

import type { Post } from "@/lib/types";
import { Eye, FileText, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BlogForm from "./BlogForm";
import EmptyState from "./EmptyState";
import ListCard, { CardThumb } from "./ListCard";
import { btn, btnIcon } from "@/components/form/buttonStyles";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import useEditDeepLink from "./useEditDeepLink";

interface BlogsListProps {
  posts: (Post & { publishedBy: { name: string } | null })[];
  /** From ?edit=<id> — opens that post's edit modal on mount. */
  editId?: string;
}

const BlogsList = ({ posts, editId }: BlogsListProps) => {
  const [modal, setModal] = useState<{ post?: Post } | null>(null);
  const closeModal = useEditDeepLink(
    editId,
    posts,
    (post) => setModal({ post }),
    () => setModal(null),
  );

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
    <div className="flex flex-wrap gap-1">
      <Link
        href={`/admin/blogs/${n.id}`}
        title="Details"
        aria-label="Details"
        className={btnIcon("secondary")}
      >
        <Eye size={15} />
      </Link>
      <button
        onClick={() => setModal({ post: n })}
        title="Edit"
        aria-label="Edit"
        className={btnIcon("secondary")}
      >
        <Pencil size={15} />
      </button>
      <DeleteButton
        url={`/api/admin/blogs/${n.id}`}
        confirmText={`Delete "${n.title}"? This cannot be undone.`}
        iconOnly
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
          className={btn("primary")}
        >
          <Plus size={16} />
          Add blog
        </button>
      </div>

      {/* ---------- md and up: table ---------- */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-225 text-left text-sm">
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
                      loading="lazy" decoding="async"
                      className="h-10 w-16 rounded object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-16 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">
                      —
                    </span>
                  )}
                </td>
                <td className="max-w-60 px-4 py-3">
                  <Link
                    href={`/admin/blogs/${n.id}`}
                    className="wrap-break-word font-medium text-slate-900 hover:text-blue-700 hover:underline"
                  >
                    {n.title}
                  </Link>
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
                <td colSpan={6} className="px-4 py-6">
                  <EmptyState icon={FileText} title="No blogs yet." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- below md: one card per post ---------- */}
      <ul className="space-y-3 md:hidden">
        {posts.map((n) => (
          <ListCard
            key={n.id}
            href={`/admin/blogs/${n.id}`}
            title={n.title}
            subtitle={n.excerpt}
            media={<CardThumb src={n.imageUrl} shape="wide" />}
            badges={statusPill(n.published)}
            fields={[
              { label: "Published by", value: n.publishedBy?.name || "—" },
              { label: "Date", value: fmtDate(n.createdAt) },
            ]}
            actions={actions(n)}
          />
        ))}

        {posts.length === 0 && (
          <li>
            <EmptyState icon={FileText} title="No blogs yet." />
          </li>
        )}
      </ul>

      <Modal
        open={modal !== null}
        onClose={closeModal}
        title={modal?.post ? `Edit: ${modal.post.title}` : "Add blog"}
        wide
      >
        {modal !== null && (
          <BlogForm
            key={modal.post?.id ?? "new"}
            post={modal.post}
            onSuccess={closeModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default BlogsList;
