import { getAllCourses, getReviews } from "@/lib/data";
import ReviewsList from "../../_components/ReviewsList";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ edit?: string }> };

const ReviewsAdminPage = async ({ searchParams }: Props) => {
  const { edit } = await searchParams;
  const [reviews, courses] = await Promise.all([getReviews(), getAllCourses()]);
  return <ReviewsList reviews={reviews} courses={courses} editId={edit} />;
};

export default ReviewsAdminPage;
