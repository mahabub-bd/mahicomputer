import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/format";
import SectionHeading from "./SectionHeading";

/** Shape of a course row on the dashboard. */
export type RecentCourse = {
  id: string;
  title: string;
  slug: string;
  tag: string;
  imageUrl: string;
  price: number;
  published: boolean;
  updatedAt: Date | string;
  category?: { title: string } | null;
  instructor?: { name: string } | null;
  /** Free-text fallback for courses saved before the instructor relation. */
  instructorName?: string;
};

const money = (value: number) => `৳${value.toLocaleString("en-BD")}`;

/** Linked instructor wins; older rows only have the typed name. */
const instructorName = (course: RecentCourse) =>
  course.instructor?.name?.trim() || course.instructorName?.trim() || "";

/** "Today" / "Yesterday" / "3 days ago", falling back to a date for older rows. */
const updatedLabel = (value: Date | string) => {
  const date = new Date(value);
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(date);
};

const StatusPill = ({ published }: { published: boolean }) =>
  published ? (
    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
      Published
    </span>
  ) : (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
      Hidden
    </span>
  );

/**
 * Recently updated courses.
 *
 * A plain table with no inner scroll — the page only fetches the handful of
 * newest rows, so the card can end naturally instead of nesting a second
 * scrollbar inside the dashboard. Secondary columns collapse into a meta line
 * under the title on phones.
 */
const RecentCourses = ({ courses }: { courses: RecentCourse[] }) => (
  <div className="min-w-0">
    <SectionHeading title="Recent courses" href="/admin/courses">
      {courses.length > 0 && (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
          {courses.length} latest
        </span>
      )}
    </SectionHeading>

    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {courses.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <BookOpen size={20} aria-hidden />
          </span>
          <p className="text-sm font-medium text-slate-700">No courses yet</p>
          <p className="text-xs text-slate-400">
            Courses you add or update show up here.
          </p>
          <Link
            href="/admin/courses"
            className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
          >
            Add your first course
            <ArrowRight size={13} aria-hidden />
          </Link>
        </div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th scope="col" className="w-full px-5 py-2.5">
                Course
              </th>
              <th scope="col" className="hidden px-4 py-2.5 sm:table-cell">
                Category
              </th>
              <th scope="col" className="hidden px-4 py-2.5 lg:table-cell">
                Instructor
              </th>
              <th scope="col" className="hidden px-4 py-2.5 text-right sm:table-cell">
                Price
              </th>
              <th scope="col" className="hidden px-4 py-2.5 sm:table-cell">
                Status
              </th>
              <th scope="col" className="hidden px-5 py-2.5 text-right sm:table-cell">
                Updated
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((course) => (
              <tr key={course.id} className="group transition hover:bg-slate-50/80">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {course.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- course image URL comes from the admin
                      <img
                        src={course.imageUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-11 w-16 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <span className="flex h-11 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 ring-1 ring-slate-200">
                        <BookOpen size={16} aria-hidden />
                      </span>
                    )}
                    <div className="min-w-0">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="block truncate font-medium text-slate-900 group-hover:text-blue-600"
                      >
                        {course.title}
                      </Link>
                      <p className="truncate text-xs text-slate-400">
                        {course.tag || course.slug}
                      </p>
                      {/* Phone-only meta line — replaces the hidden columns. */}
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 sm:hidden">
                        {course.category && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                            {course.category.title}
                          </span>
                        )}
                        <span className="font-semibold tabular-nums">
                          {money(course.price)}
                        </span>
                        <StatusPill published={course.published} />
                        <span className="text-slate-400">
                          {updatedLabel(course.updatedAt)}
                        </span>
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  {course.category ? (
                    <span
                      title={course.category.title}
                      className="inline-block max-w-36 truncate rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                    >
                      {course.category.title}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300">—</span>
                  )}
                </td>
                <td className="hidden px-4 py-3 text-xs text-slate-600 lg:table-cell">
                  <span
                    title={instructorName(course) || undefined}
                    className="block max-w-40 truncate"
                  >
                    {instructorName(course) || <span className="text-slate-300">—</span>}
                  </span>
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-slate-700 sm:table-cell">
                  {money(course.price)}
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <StatusPill published={course.published} />
                </td>
                <td className="hidden px-5 py-3 text-right text-xs text-slate-400 sm:table-cell">
                  {updatedLabel(course.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

export default RecentCourses;
