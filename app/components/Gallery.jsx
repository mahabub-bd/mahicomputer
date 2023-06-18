import Image from "next/image";
import { gallery } from "../constants";
import styles from "../styles/style";

export default function Gallery() {
  return (
    <div className={styles.boxWidth} id="gallery">
      <h2 className={`${styles.heading2} text-center my-4 font-bangla`}>
        ইমেজ গ্যালারী
      </h2>
      <div className="flex flex-wrap gap-2 justify-around">
        {gallery.map((item) => (
          <div key={item.alt}>
            <Image
              className="w-[610px] lg:w-[550px] xl:w-[580px] m-3 shadow-xl  rounded-sm h-[300px]"
              src={item.img}
              alt={item.alt}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
