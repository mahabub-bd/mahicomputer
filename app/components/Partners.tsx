import type { PartnerView } from "@/lib/types";
import Image from "next/image";
import styles from "../styles/style";

interface PartnersProps {
  partners?: PartnerView[];
}

const Partners = ({ partners = [] }: PartnersProps) => (
  <section className="section-shell bg-linear-to-b from-blue-50/50 to-white">
    <div className="mx-auto max-w-350 2xl:max-w-[1536px] px-4 sm:px-6">
      <h2
        className={`${styles.heading2} section-title text-center font-bangla`}
        data-aos="fade-up"
      >
        আমাদের সহযোগী পার্টনার
      </h2>
      <p
        className="mx-auto mt-3 max-w-2xl text-center font-bangla text-[16px] leading-7 text-slate-500"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        সরকারি অনুমোদন ও ব্যাংকিং পার্টনারসহ আমাদের বিশ্বস্ত সহযোগী প্রতিষ্ঠান
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {partners.map((item, i) => (
          /* Animation on the wrapper, hover on the card — keeps AOS's
             transition-property override from killing the hover animation. */
          <div
            key={`${item.alt}-${item.img}-${i}`}
            data-aos="fade-up"
            data-aos-delay={i * 70}
          >
            <div className="group h-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="relative aspect-16/10 w-full">
                <Image
                  src={item.img}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1200px) 30vw, 180px"
                  className="object-contain opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Partners;
