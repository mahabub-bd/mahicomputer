import {
  getPublicCategories,
  getPublicCourses,
  getPublicFaqs,
  getPublicGalleryViews,
  getPublicInstructorViews,
  getPublicNotices,
  getPublicPartnerViews,
  getPublicReviewViews,
  getPublicSiteSettings,
  getPublicSocialLinks,
  toCategoryView,
  toCourseView,
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
  Newsletter,
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
  const settings = await getPublicSiteSettings();

  // Strictly DB-driven: no fallback copy.
  const description = truncate(settings.heroSubtitle);
  const heroImage = settings.heroImageUrl;

  return {
    title: { absolute: HOME_TITLE },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      url: `${SITE_URL}/`,
      title: HOME_TITLE,
      description,
      ...(heroImage
        ? { images: [{ url: heroImage, alt: SITE_NAME }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: HOME_TITLE,
      description,
      ...(heroImage ? { images: [heroImage] } : {}),
    },
  };
};

const HomePage = async () => {
  const [rawCourses, categories, instructors, reviews, partners, gallery, settings, notices, faqs, socials] =
    await Promise.all([
      getPublicCourses(),
      getPublicCategories(),
      getPublicInstructorViews(),
      getPublicReviewViews(),
      getPublicPartnerViews(),
      getPublicGalleryViews(),
      getPublicSiteSettings(),
      getPublicNotices(),
      getPublicFaqs(),
      getPublicSocialLinks(),
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
        <Instractor instructors={instructors} />
        <WhyChooseUs settings={settings} />
        <Review reviews={reviews} />
        <Stats stats={settings.stats} />
        <NoticePreview notices={notices} />
        <Gallery items={gallery} />
        <Faq faqs={faqs} />
        <Partners partners={partners} />
        <Newsletter />
        <Contact settings={settings} social={socials} />
        <Map settings={settings} />
      </div>
    </AosProvider>
  );
};

export default HomePage;
