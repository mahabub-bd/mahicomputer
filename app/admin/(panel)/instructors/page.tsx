import { getInstructors } from "@/lib/data";
import InstructorsList from "../../_components/InstructorsList";

export const dynamic = "force-dynamic";

const InstructorsAdminPage = async () => {
  const instructors = await getInstructors();
  return <InstructorsList instructors={instructors} />;
};

export default InstructorsAdminPage;
