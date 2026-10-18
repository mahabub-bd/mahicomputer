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
        <Marquee />

        <Hero settings={settings} />
        <About settings={settings} />
        <CEO />
        <Categories categories={categories.map(toCategoryView)} />
        <Courses courses={courses} />
        <AdmissionBanner courses={courseTitles} />
        <Instractor instructors={instructors.map(toInstructorView)} />
        <WhyChooseUs />
        <Review reviews={reviews} />
        <Stats stats={settings.stats} />
        <NoticePreview notices={notices} />
        <Gallery items={gallery} />
        <Faq faqs={faqs} />
        <Partners partners={partners} />
        <Contact settings={settings} />
        <Map />
      </div>
    </AosProvider>
  );
};

export default HomePage;
