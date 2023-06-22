import Image from "next/image";
import { partners } from "../constants";
import styles from "../styles/style";

const Partners = () => (
  <div className={`${styles.boxWidth} my-5`}>
    <h6
      className={`${styles.heading2} text-center font-bangla  `}
      data-aos="fade-up"
    >
      আমাদের পার্টনার
    </h6>
    <div
      className="flex flex-wrap my-10 justify-between items-center "
      data-aos="fade-up"
    >
      {partners.map((item) => (
        <div
          key={item.alt}
          className="xs:w-[120px] xl:w-[160px] m-2 h-auto   rounded-lg xl:gap-0 md:gap-12 flex-wrap  hover:cursor-pointer"
        >
          <Image
            className=" rounded-sm text-center mx-auto "
            src={item.img}
            alt={item.alt}
          />
        </div>
      ))}
    </div>
  </div>
);

export default Partners;
