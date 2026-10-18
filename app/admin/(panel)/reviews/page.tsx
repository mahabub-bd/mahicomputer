import { getReviews } from "@/lib/data";
import ReviewsList from "../../_components/ReviewsList";

export const dynamic = "force-dynamic";

const ReviewsAdminPage = async () => {
  const reviews = await getReviews();
  return <ReviewsList reviews={reviews} />;
};

export default ReviewsAdminPage;
