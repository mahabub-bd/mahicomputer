"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, HelpCircle, Loader2, Pencil, Plus, Search, X } from "lucide-react";
import { btn, btnIcon } from "@/components/form/buttonStyles";
import { formatDate } from "@/lib/format";
import type { Faq } from "@/lib/types";
import { apiPut } from "./api";
import DeleteButton from "./DeleteButton";
import EmptyState from "./EmptyState";
import FaqForm from "./FaqForm";
import ListCard from "./ListCard";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";

interface FaqsListProps {
  faqs: Faq[];
}

type View = "all" | "live" | "hidden";

const toTime = (value: Date | string) => new Date(value).getTime();

const FaqsList = ({ faqs }: FaqsListProps) => {
  const router = useRouter();
  const [modal, setModal] = useState<{ faq?: Faq } | null>(null);
  const [view, setView] = useState<View>("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const liveFaqs = faqs.filter((f) => f.published);
  const liveCount = liveFaqs.length;
  const hiddenCount = faqs.length - liveCount;

  /* The site renders published FAQs only (by order, then creation date), so a
     number is the row's position in that list. A hidden row shows the slot it
     would take once published. */
  const rankOf = (faq: Faq) => {
    const index = liveFaqs.findIndex((f) => f.id === faq.id);
    if (index !== -1) return index + 1;
    return (
      liveFaqs.filter(
        (f) =>
          f.order < faq.order ||
          (f.order === faq.order && toTime(f.createdAt) <= toTime(faq.createdAt)),
      ).length + 1
    );
  };
  const rankLabel = (faq: Faq) => String(rankOf(faq)).padStart(2, "0");

  const needle = query.trim().toLowerCase();
  const visible = faqs.filter((f) => {
    if (view === "live" && !f.published) return false;
    if (view === "hidden" && f.published) return false;
    if (!needle) return true;
    return (
      f.question.toLowerCase().includes(needle) ||
      f.answer.toLowerCase().includes(needle)
    );
  });

  const tabs: { key: View; label: string; count: number }[] = [
    { key: "all", label: "All", count: faqs.length },
    { key: "live", label: "Live", count: liveCount },
    { key: "hidden", label: "Hidden", count: hiddenCount },
  ];

  // There is no PATCH route for FAQs, so the toggle PUTs the record back
  // unchanged apart from `published`.
  const togglePublished = async (faq: Faq) => {
    setBusyId(faq.id);
    try {
      await apiPut(`/api/admin/faqs/${faq.id}`, {
        question: faq.question,
        answer: faq.answer,
        published: !faq.published,
        order: faq.order,
      });
      toast.success(faq.published ? "FAQ hidden from the site" : "FAQ published");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  // Shared by the md+ table and the phone card list so the two
  // views can never drift apart.
  const actions = (faq: Faq) => (
    <div className="flex flex-wrap justify-end gap-1">
      <button
        onClick={() => togglePublished(faq)}
        disabled={busyId === faq.id}
        title={faq.published ? "Hide from the site" : "Show on the site"}
        aria-label={faq.published ? "Hide from the site" : "Show on the site"}
        className={btnIcon("secondary")}
      >
        {busyId === faq.id ? (
          <Loader2 size={15} className="animate-spin" />
        ) : faq.published ? (
          <EyeOff size={15} />
        ) : (
          <Eye size={15} />
        )}
      </button>
      <button
        onClick={() => setModal({ faq })}
        title="Edit"
        aria-label="Edit"
        className={btnIcon("secondary")}
      >
        <Pencil size={15} />
      </button>
      <DeleteButton
        url={`/api/admin/faqs/${faq.id}`}
        confirmText="Delete this FAQ? This cannot be undone."
        iconOnly
      />
    </div>
  );

  const empty = faqs.length === 0;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">FAQ</h1>
          <p className="mt-1 text-sm text-slate-500">
            Questions shown in the homepage FAQ section
          </p>
        </div>
        <button onClick={() => setModal({})} className={btn("primary")}>
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      {empty ? (
        <EmptyState
          icon={HelpCircle}
          title="No FAQs yet."
          description="Add the first question and answer — it goes live in the homepage accordion right away."
          action={
            <button onClick={() => setModal({})} className={btn("primary")}>
              <Plus size={16} aria-hidden />
              Add FAQ
            </button>
          }
        />
      ) : (
        <>
          {liveCount === 0 && (
            <p className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3.5 py-2.5 text-[13px] leading-6 text-amber-800">
              <EyeOff size={16} className="mt-0.5 shrink-0" aria-hidden />
              <span>
                Every question is hidden, so the homepage skips the FAQ section
                entirely. Publish at least one to bring it back.
              </span>
            </p>
          )}

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div
              role="group"
              aria-label="Filter by visibility"
              className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm"
            >
              {tabs.map((tab) => {
                const active = view === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setView(tab.key)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-medium transition duration-150 ${
                      active
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`text-[11px] tabular-nums ${
                        active ? "text-white/60" : "text-slate-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <Search
                size={15}
                aria-hidden
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search question or answer"
                aria-label="Search FAQs"
                className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-8 text-[13px] text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {visible.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No question matches those filters."
              description={
                needle
                  ? `Nothing contains “${query.trim()}”. Try a shorter word.`
                  : "No question has that status yet."
              }
              action={
                <button
                  onClick={() => {
                    setView("all");
                    setQuery("");
                  }}
                  className={btn("secondary", "sm")}
                >
                  Clear filters
                </button>
              }
              className="border-slate-200 bg-white"
            />
          ) : (
            <>
              {/* ---------- md and up: table ----------
                  Six columns scroll inside the card instead of squeezing
                  on tablet. */}
              <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
                <table className="w-full min-w-200 text-left text-sm">
                  <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Pos.</th>
                      <th className="px-4 py-3">Question / answer</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Updated</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visible.map((faq) => (
                      <tr
                        key={faq.id}
                        className={`align-top transition-colors hover:bg-slate-50 ${
                          faq.published ? "" : "bg-slate-50/50"
                        }`}
                      >
                        <td className="whitespace-nowrap px-4 py-3">
                          <span
                            title="Position in the homepage accordion"
                            className={`inline-flex h-6 w-7 items-center justify-center rounded-md font-mono text-[11px] font-medium tabular-nums ${
                              faq.published
                                ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                                : "bg-white text-slate-400 ring-1 ring-slate-200"
                            }`}
                          >
                            {rankLabel(faq)}
                          </span>
                        </td>
                        <td className="max-w-120 px-4 py-3">
                          <p className="font-bangla font-medium text-slate-900 wrap-break-word">
                            {faq.question}
                          </p>
                          <p className="mt-0.5 line-clamp-2 font-bangla whitespace-pre-line text-slate-500">
                            {faq.answer}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge published={faq.published} />
                        </td>
                        <td className="px-4 py-3 text-slate-500">{faq.order}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                          {formatDate(faq.updatedAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end">{actions(faq)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ---------- below md: one card per FAQ ----------
                  The table is unusable at phone widths, so each row becomes
                  a stacked card: question + status, updated date, clamped
                  answer, then position / order and a wrapping action row. */}
              <ul className="space-y-3 md:hidden">
                {visible.map((faq) => (
                  <ListCard
                    key={faq.id}
                    title={
                      <span className="font-bangla wrap-break-word">
                        {faq.question}
                      </span>
                    }
                    subtitle={`Updated ${formatDate(faq.updatedAt)}`}
                    badges={<StatusBadge published={faq.published} />}
                    body={
                      <p className="line-clamp-3 font-bangla whitespace-pre-line text-xs leading-6 text-slate-500">
                        {faq.answer}
                      </p>
                    }
                    fields={[
                      { label: "Position", value: `#${rankLabel(faq)}` },
                      { label: "Order", value: faq.order },
                    ]}
                    actions={actions(faq)}
                  />
                ))}
              </ul>
            </>
          )}
        </>
      )}

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.faq ? "Edit FAQ" : "Add FAQ"}
      >
        {modal !== null && (
          <FaqForm
            key={modal.faq?.id ?? "new"}
            faq={modal.faq}
            onSuccess={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default FaqsList;
