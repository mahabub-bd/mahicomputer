<<<<<<< HEAD
import { getPublicReviewViews } from "@/lib/data";
=======
import { getReviewViews } from "@/lib/data";
>>>>>>> 8b57dd81f4b6274869ff3d96c8916c651ef76d20
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
        <Review reviews={reviews} />
      </div>
    </AosProvider>
  );
};

export default FeedbackPage;
