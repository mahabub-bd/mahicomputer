import { paymentapp } from "@/public";
import Image from "next/image";
import styles from "../styles/style";

const About = () => {
  return (
    <div className="qx-section-29 " id="about">
      <section className={`${styles.boxWidth} mx-auto`}>
        <h2 className={`text-center ${styles.heading2} qpay-gradient`}>
          About Qpay
        </h2>

        <div className={`flex md:flex-row flex-col`}>
          <div
            className="flex flex-col flex-1 xl:px-0 sm:px-16 px-6"
            data-aos="fade-right"
          >
            <p className={`${styles.paragraph} mt-5  `}>
              Q-Cash has introduced QPay, a new financial technology application
              that offers both basic and advanced FinTech and electronic payment
              services to the clients of Q-Cash member banks. Its also
              impressive that QPay includes more robust features compared to
              other FinTech apps.
            </p>

            <p className={`${styles.paragraph} mt-5`}>
              Its always beneficial for individuals, business owners, and
              consumers to have access to specialized features and an easy
              operational process to manage their financial operations and
              processes effectively. With Qpay introduction, its expected that
              it will provide a whole new experience to the citizens of
              Bangladesh, and it will make managing their financial operations
              much more comfortable and convenient.
            </p>
          </div>
          <div
            className={`flex flex-1 items-center xl:justify-end md:justify-center `}
            data-aos="fade-left"
          >
            <Image
              src={paymentapp}
              alt="paymentapp "
              className="w-[90%]"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
