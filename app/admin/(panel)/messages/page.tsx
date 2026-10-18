import { prisma } from "@/lib/prisma";
import MessagesList from "../../_components/MessagesList";
import PageHeader from "../../_components/PageHeader";

export const dynamic = "force-dynamic";

const MessagesAdminPage = async () => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <PageHeader
        title="Messages"
        description={
          messages.length > 0
            ? `${messages.length} total · ${unread} unread`
            : "Contact form submissions"
        }
      />
      <MessagesList messages={messages} />
    </div>
  );
};

export default MessagesAdminPage;
