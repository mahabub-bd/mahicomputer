import { PageHead } from "@/app/_components/PageHead";
import BlogCard from "@/app/components/BlogCard";
import styles from "@/app/styles/style";
import { getPublicPosts } from "@/lib/data";
import { SITE_NAME, truncate } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: truncate(
    `Computer training tips, course guides and updates from ${SITE_NAME}.`
  ),
  alternates: { canonical: "/blogs" },
  openGraph: { url: "/blogs", title: `Blog | ${SITE_NAME}` },
};

const BlogsPage = async () => {
  const posts = await getPublicPosts();

  return (
    <>
      <PageHead
        items={[{ label: "ব্লগ" }]}
        title="ব্লগ"
        subtitle="কম্পিউটার শেখার টিপস, কোর্স গাইড ও আপডেট নিউজ"
      />

      <div className="mx-auto max-w-350 2xl:max-w-[1536px] px-4 py-10 sm:px-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="mt-12 text-center font-bangla text-slate-500">
          বর্তমানে কোনো ব্লগ নেই।
        </p>
      )}
      </div>
    </>
  );
};

export default BlogsPage;
