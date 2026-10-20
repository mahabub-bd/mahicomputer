import Link from "next/link";
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
};

/**
 * Recent courses table.
 *
 * The list is capped in height and scrolls *inside its own card* (with a
 * sticky header) so the dashboard keeps a predictable rhythm instead of
 * growing a long table. `min-w-0` on the wrapper lets the grid column
 * shrink, so the scroll stays inside the card rather than pushing the whole
 * page sideways.
 *
 * On phones the secondary columns collapse into a meta line under the
 * title, so no horizontal scroll is needed on small screens either.
 */
const RecentCourses = ({ courses }: { courses: RecentCourse[] }) => (
  <div className="min-w-0">
    <SectionHeading title="Recent courses" href="/admin/courses" />

    {/* Section scroll: capped height + overflow-auto, horizontal and
        vertical, with the scrollbar themed by .admin-table-scroll. */}
    <div className="admin-table-scroll max-h-[26rem] overflow-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm sm:max-h-[30rem] lg:max-h-[34rem]">
      {/* border-separate keeps the sticky header working — the default
          `border-collapse: collapse` breaks position: sticky on <th>. */}
      <table className="w-full border-separate border-spacing-0 text-left text-sm sm:min-w-[32rem]">
        <thead className="text-xs font-semibold uppercase text-slate-400">
          <tr>
            <th className="sticky top-0 z-10 border-b border-slate-100 bg-white px-4 py-3">
              Course
            </th>
            <th className="sticky top-0 z-10 hidden border-b border-slate-100 bg-white px-4 py-3 sm:table-cell">
              Price
            </th>
            <th className="sticky top-0 z-10 hidden border-b border-slate-100 bg-white px-4 py-3 sm:table-cell">
              Status
            </th>
            <th className="sticky top-0 z-10 hidden border-b border-slate-100 bg-white px-4 py-3 text-right sm:table-cell">
              Updated
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id} className="group hover:bg-slate-50">
              <td className="border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  {c.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.imageUrl}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-10 w-16 shrink-0 rounded object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <Link
                      href={`/admin/courses/${c.id}`}
                      className="block truncate font-medium text-slate-900 hover:text-blue-600"
                    >
                      {c.title}
                    </Link>
                    <p className="truncate text-xs text-slate-400">
                      {c.tag || c.slug}
                    </p>
                    {/* Phone-only meta line — replaces the hidden columns. */}
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-slate-500 sm:hidden">
                      <span className="font-medium">{c.price}৳</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] ${
                          c.published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {c.published ? "Published" : "Hidden"}
                      </span>
                      <span className="text-slate-400">
                        {new Date(c.updatedAt).toLocaleDateString("en-GB")}
                      </span>
                    </p>
                  </div>
                </div>
              </td>
              <td className="hidden border-b border-slate-100 px-4 py-3 text-slate-600 sm:table-cell">
                {c.price}৳
              </td>
              <td className="hidden border-b border-slate-100 px-4 py-3 sm:table-cell">
                {c.published ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                    Published
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                    Hidden
                  </span>
                )}
              </td>
              <td className="hidden border-b border-slate-100 px-4 py-3 text-right text-xs text-slate-400 sm:table-cell">
                {new Date(c.updatedAt).toLocaleDateString("en-GB")}
              </td>
            </tr>
          ))}
          {courses.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center text-slate-500"
              >
                No courses yet.{" "}
                <Link href="/admin/courses" className="text-blue-600 hover:underline">
                  Add one
                </Link>
                .
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentCourses;
