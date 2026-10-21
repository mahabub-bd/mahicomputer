import { PageHead } from "@/app/_components/PageHead";
import styles from "@/app/styles/style";
import { getPublicNewsletters } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

// Content is DB-driven and editable from the admin panel — never prerender at build time.

export const metadata: Metadata = {
  title: "Newsletters",
  description: `News, updates and announcements from ${SITE_NAME} — new batches, offers and events.`,
  alternates: { canonical: "/newsletters" },
  openGraph: { url: "/newsletters", title: `Newsletters | ${SITE_NAME}` },
};

const NewslettersPage = async () => {
  const newsletters = await getPublicNewsletters();

  return (
    <>
      <PageHead
        items={[{ label: "নিউজলেটার" }]}
        title="নিউজলেটার"
        subtitle="নতুন ব্যাচ, অফার ও ইভেন্টের খবর"
      />

      <div className="mx-auto max-w-350 space-y-6 px-4 py-10 sm:px-6 lg:space-y-8">
        {newsletters.map((issue) => {
          const paragraphs = issue.body
            .split(/\n{2,}/)
            .map((p) => p.trim())
            .filter(Boolean);

          return (
            <article
              key={issue.id}
              className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bangla text-lg font-semibold text-blue-700">
                  {issue.title}
                </h3>
                <time
                  dateTime={new Date(issue.date).toISOString()}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
                >
                  {new Date(issue.date).toLocaleDateString("bn-BD", { dateStyle: "medium" })}
                </time>
              </div>
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="mt-3 font-bangla leading-7 text-slate-600"
                >
                  {paragraph}
                </p>
              ))}
            </article>
          );
        })}

        {newsletters.length === 0 && (
          <p className="mt-8 text-center font-bangla text-slate-500">
            বর্তমানে কোনো নিউজলেটার নেই।
          </p>
        )}
      </div>
    </>
  );
};

export default NewslettersPage;
