import { getAllCourses, getReviews } from "@/lib/data";
import ReviewsList from "../../_components/ReviewsList";

export const dynamic = "force-dynamic";

const ReviewsAdminPage = async () => {
  const [reviews, courses] = await Promise.all([getReviews(), getAllCourses()]);
  return <ReviewsList reviews={reviews} courses={courses} />;
};

export default ReviewsAdminPage;
