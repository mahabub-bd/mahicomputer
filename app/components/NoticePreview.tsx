import Link from "next/link";
import { ArrowUpRight, Megaphone } from "lucide-react";
import type { Notice } from "@/lib/types";

interface NoticePreviewProps {
  notices: Notice[];
}

/** Latest notices on the homepage, linking to the full notice board. */
const NoticePreview = ({ notices }: NoticePreviewProps) => {
  if (notices.length === 0) return null;

  return (
    <section className="section-shell bg-slate-50">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2
            className="flex items-center gap-2 font-bangla text-[clamp(1.4rem,2.5vw,2rem)] font-bold text-[#112244]"
            data-aos="fade-up"
          >
            <Megaphone size={24} className="text-blue-600" />
            সর্বশেষ নোটিশ
          </h2>
          <Link
            href="/notice"
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
            data-aos="fade-up"
          >
            সব নোটিশ
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {notices.slice(0, 3).map((notice, i) => (
            <Link
              key={notice.id}
              href="/notice"
              data-aos="fade-up"
              data-aos-delay={i * 80}
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <time
                dateTime={new Date(notice.date).toISOString()}
                className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600"
              >
                {new Date(notice.date).toLocaleDateString("bn-BD", {
                  dateStyle: "medium",
                })}
              </time>
              <h3 className="mt-3 line-clamp-2 font-bangla text-[16px] font-bold leading-6 text-slate-900 transition-colors group-hover:text-blue-700">
                {notice.title}
              </h3>
              {notice.body && (
                <p className="mt-2 line-clamp-2 font-bangla text-[13px] leading-6 text-slate-500">
                  {notice.body}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NoticePreview;
