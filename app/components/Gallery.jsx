import Image from "next/image";
import { gallery } from "../constants";
import styles from "../styles/style";

export default function Gallery() {
  return (
    <div className={styles.boxWidth} id="gallery">
      <h2
        className={`${styles.heading2} text-center my-4 font-bangla`}
        data-aos="fade-up"
      >
        ইমেজ গ্যালারী
      </h2>
      <div className="flex flex-wrap gap-20 justify-around">
        {gallery.map((item) => (
          <div
            key={item.alt}
            className="lg:w-[550px] xl:w-[580px] lg:h-[310px] xl:h-[326.25] hover:scale-95 hover:border-blue-500"
          >
            <Image
              className="m-2 shadow-xl  rounded-sm w-full h-full hover:z-0"
              src={item.img}
              alt={item.alt}
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}
