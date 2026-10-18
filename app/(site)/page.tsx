import {
  getCategories,
  getCourseViews,
  getFaqs,
  getGalleryViews,
  getInstructors,
  getNotices,
  getPartnerViews,
  getReviewViews,
  getSiteSettings,
  toCategoryView,
  toInstructorView,
} from "@/lib/data";
import AosProvider from "../_components/AosProvider";
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

const HomePage = async () => {
  const [courses, categories, instructors, reviews, partners, gallery, settings, notices, faqs] =
    await Promise.all([
      getCourseViews(),
      getCategories(),
      getInstructors(),
      getReviewViews(),
      getPartnerViews(),
      getGalleryViews(),
      getSiteSettings(),
      getNotices(),
      getFaqs(),
    ]);

  const courseTitles = courses.map((c) => c.title);

  return (
    <AosProvider>
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
