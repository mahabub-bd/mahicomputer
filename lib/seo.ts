import type { Course, Faq, SocialLink } from "@/lib/types";
import type { SiteSettingsView } from "@/lib/types";
import { toStringArray } from "./course-view";
import { absoluteUrl, assetUrl, SITE_NAME, SITE_SHORT_NAME, truncate } from "./site";

/**
 * JSON-LD builders for the homepage (schema.org rich-result eligibility).
 * Everything is derived from the admin-managed DB content so it never
 * drifts from what the page renders.
 */

type JsonLdNode = Record<string, unknown>;

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").trim();

/** EducationTrainingCenter local business — local SEO + knowledge panel. */
function buildOrganization(settings: SiteSettingsView, socials: SocialLink[]): JsonLdNode {
  const sameAs = socials
    .map((s) => s.link)
    .filter((link) => /^https?:\/\//i.test(link));

  return {
    "@type": ["LocalBusiness", "EducationalTrainingCenter"],
    "@id": `${absoluteUrl("/")}#organization`,
    name: SITE_NAME,
    alternateName: SITE_SHORT_NAME,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: assetUrl("/images/logo_dark.webp"),
      width: 134,
      height: 67,
    },
    image: assetUrl("/images/hero.jpg"),
    description: truncate(
      settings.aboutText ||
        "Practical computer and IT training courses with expert instructors, hands-on labs and certification.",
    ),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.address
      ? { address: { "@type": "PostalAddress", streetAddress: stripHtml(settings.address) } }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
    areaServed: "BD",
    priceRange: "$$",
  };
}

function buildWebSite(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    url: absoluteUrl("/"),
    name: SITE_NAME,
    alternateName: SITE_SHORT_NAME,
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
    inLanguage: "en",
  };
}

/** ItemList of published courses, linking to their detail pages. */
function buildCourseList(courses: Course[]): JsonLdNode | null {
  if (courses.length === 0) return null;
  return {
    "@type": "ItemList",
    name: "Courses",
    numberOfItems: courses.length,
    itemListElement: courses.slice(0, 20).map((course, index) => {
      const description = truncate(toStringArray(course.description).join(" "));
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Course",
          name: course.title,
          url: absoluteUrl(`/courses/${course.slug}`),
          ...(course.imageUrl ? { image: assetUrl(course.imageUrl) } : {}),
          ...(description ? { description } : {}),
          provider: { "@id": `${absoluteUrl("/")}#organization` },
          ...(course.instructorName
            ? {
                instructor: {
                  "@type": "Person",
                  name: course.instructorName,
                },
              }
            : {}),
        },
      };
    }),
  };
}

/** FAQPage — powers the "Frequently Asked Questions" rich results. */
function buildFaqPage(faqs: Faq[]): JsonLdNode | null {
  if (faqs.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.slice(0, 30).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** Homepage structured-data graph (Organization + WebSite + courses + FAQ). */
export function buildHomeJsonLd(input: {
  settings: SiteSettingsView;
  socials: SocialLink[];
  courses: Course[];
  faqs: Faq[];
}): JsonLdNode {
  const organization = buildOrganization(input.settings, input.socials);
  const nodes: JsonLdNode[] = [
    organization,
    buildWebSite(),
    buildCourseList(input.courses),
    buildFaqPage(input.faqs),
  ].filter((node): node is JsonLdNode => node !== null);

  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
