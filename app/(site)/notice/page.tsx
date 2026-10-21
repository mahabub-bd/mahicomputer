import { PageHead } from "@/app/_components/PageHead";
import { Paperclip } from "lucide-react";
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
    <>
      <PageHead
        items={[{ label: "নোটিশ বোর্ড" }]}
        title="নোটিশ বোর্ড"
        subtitle="ভর্তি, পরীক্ষা ও অন্যান্য সাম্প্রতিক সব ঘোষণা একসাথে এখানে দেখুন"
      />

      <div className="mx-auto max-w-350 space-y-6 px-4 py-10 sm:px-6 lg:space-y-8">
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
                {new Date(notice.date).toLocaleDateString("bn-BD", { dateStyle: "medium" })}
              </time>
            </div>
            {notice.body && (
              <p className="mt-3 whitespace-pre-wrap font-bangla leading-7 text-slate-600">
                {notice.body}
              </p>
            )}
            {notice.attachmentUrl && (
              <a
                href={notice.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200 hover:text-blue-700"
              >
                <Paperclip size={14} aria-hidden />
                {notice.attachmentName || "Attachment"}
              </a>
            )}
          </article>
        ))}

        {notices.length === 0 && (
          <p className="mt-8 text-center font-bangla text-slate-500">
            বর্তমানে কোনো নোটিশ নেই।
          </p>
        )}
      </div>
    </>
  );
};

export default NoticeBoardPage;
