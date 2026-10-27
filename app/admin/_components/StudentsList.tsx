import Link from "next/link";
import type { Enrollment } from "@/lib/types";
import { GraduationCap, Phone } from "lucide-react";
import EmptyState from "./EmptyState";

interface StudentsListProps {
  students: Enrollment[];
  /** Course lookup for the fee fallback (admissions may not have a fee saved). */
  courses: { title: string; price: number; installmentPlan?: unknown }[];
}

/**
 * Roster of approved admissions (students). Read-only — management happens
 * on the admission detail page each row links to.
 */
const StudentsList = ({ students, courses }: StudentsListProps) => {
  if (students.length === 0) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="No students yet."
        description="Approve an admission to create one."
      />
    );
  }

  // Fee falls back to the course price until the admission has its own fee.
  const feeOf = (s: Enrollment) =>
    s.courseFee || courses.find((c) => c.title === s.course)?.price || 0;
  const planOf = (s: Enrollment): number[] => {
    const own = s.installmentPlan;
    if (Array.isArray(own) && own.some((a) => typeof a === "number")) {
      return own.filter((a): a is number => typeof a === "number");
    }
    const course = courses.find((c) => c.title === s.course);
    return Array.isArray(course?.installmentPlan)
      ? (course!.installmentPlan as number[]).filter((a) => typeof a === "number")
      : [];
  };
  const due = (s: Enrollment) =>
    Math.max(feeOf(s) - s.discount - s.paidAmount, 0);

  return (
    <div>
      {/* ---------- md and up: table ---------- */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-3xl text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Student ID</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Installments</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <code className="rounded bg-slate-50 px-1.5 py-0.5 text-xs font-semibold text-blue-700">
                    {s.studentId}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {s.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.photoUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                        {s.name
                          .trim()
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((w) => w[0]?.toUpperCase())
                          .join("") || "?"}
                      </span>
                    )}
                    <Link
                      href={`/admin/enrollments/${s.id}`}
                      className="truncate font-medium text-slate-900 hover:text-blue-700 hover:underline"
                    >
                      {s.name}
                    </Link>
                  </div>
                </td>
                <td className="max-w-56 truncate px-4 py-3 text-slate-600">{s.course || "—"}</td>
                <td className="px-4 py-3 font-medium text-slate-700">
                  {feeOf(s) > 0 ? `৳${feeOf(s).toLocaleString("en-BD")}` : "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {planOf(s).length > 0
                    ? planOf(s).map((a) => `৳${a.toLocaleString("en-BD")}`).join(" + ")
                    : s.installments > 1
                      ? s.installments
                      : "—"}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {s.paidAmount > 0 ? `৳${s.paidAmount.toLocaleString("en-BD")}` : "—"}
                </td>
                <td className="px-4 py-3">
                  {feeOf(s) === 0 ? (
                    <span className="text-xs text-slate-400">No fee set</span>
                  ) : due(s) > 0 ? (
                    <span className="font-medium text-rose-600">
                      ৳{due(s).toLocaleString("en-BD")}
                    </span>
                  ) : (
                    <span className="text-emerald-600">Paid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- below md: one card per student ---------- */}
      <ul className="space-y-3 md:hidden">
        {students.map((s) => (
          <li key={s.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              {s.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.photoUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                  {s.name
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0]?.toUpperCase())
                    .join("") || "?"}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <code className="rounded bg-slate-50 px-1.5 py-0.5 text-xs font-semibold text-blue-700">
                    {s.studentId}
                  </code>
                  <Link
                    href={`/admin/enrollments/${s.id}`}
                    className="truncate font-medium text-slate-900 hover:text-blue-700 hover:underline"
                  >
                    {s.name}
                  </Link>
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <Phone size={12} className="shrink-0 text-slate-400" />
                  {s.phone}
                </p>
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-sm sm:grid-cols-4">
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">Course</dt>
                <dd className="mt-0.5 truncate font-medium text-slate-700">{s.course || "—"}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">Fee</dt>
                <dd className="mt-0.5 font-medium text-slate-700">
                  {feeOf(s) > 0 ? `৳${feeOf(s).toLocaleString("en-BD")}` : "—"}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">Installments</dt>
                <dd className="mt-0.5 truncate font-medium text-slate-700">
                  {planOf(s).length > 0
                    ? planOf(s).map((a) => `৳${a.toLocaleString("en-BD")}`).join(" + ")
                    : s.installments > 1
                      ? s.installments
                      : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">Paid</dt>
                <dd className="mt-0.5 font-medium text-slate-700">
                  {s.paidAmount > 0 ? `৳${s.paidAmount.toLocaleString("en-BD")}` : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">Due</dt>
                <dd className="mt-0.5 font-medium">
                  {feeOf(s) === 0 ? (
                    <span className="text-xs text-slate-400">No fee set</span>
                  ) : due(s) > 0 ? (
                    <span className="text-rose-600">৳{due(s).toLocaleString("en-BD")}</span>
                  ) : (
                    <span className="text-emerald-600">Paid</span>
                  )}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentsList;
