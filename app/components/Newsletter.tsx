import NewsletterSignup from "../_components/NewsletterSignup";
import styles from "../styles/style";

/**
 * Closing "stay updated" band on the home page.
 *
 * This replaced the newsletter form's old home in the site footer — same
 * form component, now a full-width dark CTA strip so it reads as a section
 * of its own instead of a footer afterthought.
 */
const Newsletter = () => (
  <section
    id="newsletter"
    className={`${styles.boxWidth} px-4 pb-16 sm:px-6 sm:pb-24`}
  >
    <div
      className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 text-center shadow-lg sm:px-10 sm:py-14"
      data-aos="fade-up"
    >
      {/* Brand glows, same trick the hero and CEO sections use */}
      <span
        className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-blue-600/25 blur-3xl"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-24 -right-12 h-64 w-64 rounded-full bg-rose-500/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-xl">
        <NewsletterSignup />
      </div>
    </div>
  </section>
);

export default Newsletter;
