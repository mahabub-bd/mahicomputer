import Link from "next/link";
import SectionHeading from "./SectionHeading";

/** Shape of a course row on the dashboard (relation fields are pre-selected). */
export type RecentCourse = {
  id: string;
  title: string;
  slug: string;
  tag: string;
  imageUrl: string;
  price: number;
  published: boolean;
  updatedAt: Date | string;
  instructorName: string;
  instructorPhotoUrl: string;
  instructor: { name: string; imageUrl: string } | null;
  category: { title: string } | null;
};

/** Instructor label: linked instructor first, then the course's own text field. */
const instructorName = (c: RecentCourse) => c.instructor?.name || c.instructorName || "";
const instructorPhoto = (c: RecentCourse) => c.instructor?.imageUrl || c.instructorPhotoUrl || "";

/** Recent courses table — scrolls horizontally on small screens. */
const RecentCourses = ({ courses }: { courses: RecentCourse[] }) => (
  <div>
    <SectionHeading title="Recent courses" href="/admin/courses" />
    <div className="admin-table-scroll overflow-x-auto rounded-xl bg-white shadow-sm">
      {/* min-w keeps the table scrollable on mobile instead of
          squeezing the columns together on small screens. */}
      <table className="w-full min-w-160 text-left text-sm">
        <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Instructor</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {courses.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {c.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.imageUrl}
                      alt=""
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
                    <p className="truncate text-xs text-slate-400">{c.tag || c.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                {c.category ? (
                  <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {c.category.title}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                {instructorName(c) ? (
                  <div className="flex items-center gap-2">
                    {instructorPhoto(c) && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={instructorPhoto(c)}
                        alt=""
                        className="h-7 w-7 shrink-0 rounded-full object-cover"
                      />
                    )}
                    <span className="truncate text-slate-700">{instructorName(c)}</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-600">{c.price}৳</td>
              <td className="px-4 py-3">
                {c.published ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                    Published
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                    Hidden
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right text-xs text-slate-400">
                {new Date(c.updatedAt).toLocaleDateString("en-GB")}
              </td>
            </tr>
          ))}
          {courses.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
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
