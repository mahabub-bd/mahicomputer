import { PageHead } from "@/app/_components/PageHead";
import { getPublicReviewViews } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";
import AosProvider from "@/app/_components/AosProvider";
import { Review } from "@/app/components";
import type { Metadata } from "next";

// Content is DB-driven and editable from the admin panel — never prerender at build time.

export const metadata: Metadata = {
  title: "Student Feedback",
  description:
    "Read genuine reviews and success stories from students of Mahi Computer Training Center.",
  alternates: { canonical: "/feedback" },
  openGraph: { url: "/feedback", title: `Student Feedback | ${SITE_NAME}` },
};

const FeedbackPage = async () => {
  const reviews = await getPublicReviewViews();

  return (
    <AosProvider>
      <div className="w-full overflow-hidden scroll-smooth">
        <PageHead items={[{ label: "স্টুডেন্ট রিভিউ" }]} />
        <Review reviews={reviews} />
      </div>
    </AosProvider>
  );
};

export default FeedbackPage;
