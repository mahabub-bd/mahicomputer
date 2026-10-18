import { getReviewViews } from "@/lib/data";
import AosProvider from "@/app/_components/AosProvider";
import { Review } from "@/app/components";

// Content is DB-driven and editable from the admin panel — never prerender at build time.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Feedback — Mahi Computer Training Center",
};

const FeedbackPage = async () => {
  const reviews = await getReviewViews();

  return (
    <AosProvider>
      <div className="w-full overflow-hidden scroll-smooth">
        <Review reviews={reviews} />
      </div>
    </AosProvider>
  );
};

export default FeedbackPage;
