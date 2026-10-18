import { prisma } from "@/lib/prisma";
import BlogsList from "../../_components/BlogsList";

export const dynamic = "force-dynamic";

const BlogsAdminPage = async () => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { publishedBy: { select: { name: true } } },
  });

  return <BlogsList posts={posts} />;
};

export default BlogsAdminPage;
