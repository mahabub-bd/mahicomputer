import {
  getCourses,
  getCategories,
  getFaqs,
  getGalleryViews,
  getInstructors,
  getNotices,
  getPartnerViews,
  getReviewViews,
  getSiteSettings,
  getSocialLinks,
  toCategoryView,
  toCourseView,
  toInstructorView,
} from "@/lib/data";
import { buildHomeJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_URL, truncate } from "@/lib/site";
import type { Metadata } from "next";
import AosProvider from "../_components/AosProvider";
import JsonLd from "../_components/JsonLd";
import {
  About,
  Categories,
  CEO,
  Contact,
  Courses,
  Gallery,
  Hero,
  Instractor,
  Map,
  Marquee,
  Partners,
  Review,
  Stats,
} from "../components";
import AdmissionBanner from "../components/AdmissionBanner";
import Faq from "../components/Faq";
import NoticePreview from "../components/NoticePreview";
import WhyChooseUs from "../components/WhyChooseUs";

const HOME_TITLE = `${SITE_NAME} — Computer & IT Courses`;

export const generateMetadata = async (): Promise<Metadata> => {
  const [settings, courses, categories] = await Promise.all([
    getSiteSettings(),
    getCourses(),
    getCategories(),
  ]);

  // DB-driven description: hero line, or a real course/category name list.
  const topicNames = [
    ...new Set([
      ...categories.slice(0, 4).map((c) => c.title),
      ...courses.slice(0, 6).map((c) => c.title),
    ]),
  ].join(", ");
  const fallback = topicNames
    ? `${SITE_NAME} offers ${topicNames} and more — expert instructors, hands-on training and certification.`
    : `${SITE_NAME} — practical computer and IT training with expert instructors, hands-on labs and certification.`;
  const description = truncate(settings.heroSubtitle || fallback);
  const heroImage = settings.heroImageUrl || "/images/hero.jpg";

  return {
    title: { absolute: HOME_TITLE },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      url: `${SITE_URL}/`,
      title: HOME_TITLE,
      description,
      images: [
        {
          url: heroImage,
          // Dimensions only known for the bundled fallback image.
          ...(settings.heroImageUrl
            ? {}
            : { width: 2000, height: 1199 }),
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: HOME_TITLE,
      description,
      images: [heroImage],
    },
  };
};

const HomePage = async () => {
  const [rawCourses, categories, instructors, reviews, partners, gallery, settings, notices, faqs, socials] =
    await Promise.all([
      getCourses(),
      getCategories(),
      getInstructors(),
      getReviewViews(),
      getPartnerViews(),
      getGalleryViews(),
      getSiteSettings(),
      getNotices(),
      getFaqs(),
      getSocialLinks(),
    ]);

  const courses = rawCourses.map(toCourseView);
  const courseTitles = courses.map((c) => c.title);

  // Structured data for search engines (Organization, WebSite, Courses, FAQ).
  const jsonLd = buildHomeJsonLd({
    settings,
    socials,
    courses: rawCourses,
    faqs,
  });

  return (
    <AosProvider>
      <JsonLd data={jsonLd} />
      <div className=" w-full overflow-hidden scroll-smooth ">
        <Marquee settings={settings} />

        <Hero settings={settings} />
        <About settings={settings} />
        <CEO settings={settings} />
        <Categories categories={categories.map(toCategoryView)} />
        <Courses courses={courses} />
        <AdmissionBanner courses={courseTitles} settings={settings} />
        <Instractor instructors={instructors.map(toInstructorView)} />
        <WhyChooseUs settings={settings} />
        <Review reviews={reviews} />
        <Stats stats={settings.stats} />
        <NoticePreview notices={notices} />
        <Gallery items={gallery} />
        <Faq faqs={faqs} />
        <Partners partners={partners} />
        <Contact settings={settings} />
        <Map settings={settings} />
      </div>
    </AosProvider>
  );
};

export default HomePage;
