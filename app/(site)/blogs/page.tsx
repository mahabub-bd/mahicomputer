import BlogCard from "@/app/components/BlogCard";
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
    <div className="mx-auto max-w-350 px-4 py-5 sm:py-10 sm:px-6">
      <h1 className="text-center font-bangla text-[28px] font-bold text-slate-900 sm:text-[36px]">
        ব্লগ
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-center font-bangla text-[15px] leading-7 text-slate-500">
        কম্পিউটার শেখার টিপস, কোর্স গাইড ও আপডেট নিউজ
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  );
};

export default BlogsPage;
