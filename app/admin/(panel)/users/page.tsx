import { getUsers } from "@/lib/data";
import UsersList from "../../_components/UsersList";

export const dynamic = "force-dynamic";

const UsersAdminPage = async () => {
  const users = await getUsers();
  return <UsersList users={users} />;
};

export default UsersAdminPage;
