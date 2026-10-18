import styles from "@/app/styles/style";
import { getPublicNotices } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

// Content is DB-driven and editable from the admin panel — never prerender at build time.



export const metadata: Metadata = {
  title: "Notice Board",
  description:
    "Official announcements, admission notices and exam updates from Mahi Computer Training Center.",
  alternates: { canonical: "/notice" },
  openGraph: { url: "/notice", title: `Notice Board | ${SITE_NAME}` },
};

const NoticeBoardPage = async () => {
  const notices = await getPublicNotices();

  return (
    <div className={`${styles.boxWidth} ${styles.paddingY}`}>
      <h2 className={`text-center ${styles.heading2} font-bangla`}>নোটিশ বোর্ড</h2>

      <div className="mx-auto mt-8 max-w-3xl space-y-4">
        {notices.map((notice) => (
          <article
            key={notice.id}
            className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bangla text-lg font-semibold text-blue-700">
                {notice.title}
              </h3>
              <time
                dateTime={new Date(notice.date).toISOString()}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
              >
                {new Date(notice.date).toLocaleDateString("en-GB", { dateStyle: "medium" })}
              </time>
            </div>
            {notice.body && (
              <p className="mt-3 whitespace-pre-wrap font-bangla leading-7 text-slate-600">
                {notice.body}
              </p>
            )}
          </article>
        ))}

        {notices.length === 0 && (
          <p className="mt-8 text-center font-bangla text-slate-500">
            বর্তমানে কোনো নোটিশ নেই।
          </p>
        )}
      </div>
    </div>
  );
};

export default NoticeBoardPage;
