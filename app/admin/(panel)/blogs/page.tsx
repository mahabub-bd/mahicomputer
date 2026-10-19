import { prisma } from "@/lib/prisma";
import BlogsList from "../../_components/BlogsList";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ edit?: string }> };

const BlogsAdminPage = async ({ searchParams }: Props) => {
  const { edit } = await searchParams;
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { publishedBy: { select: { name: true } } },
  });

  return <BlogsList posts={posts} editId={edit} />;
};

export default BlogsAdminPage;
