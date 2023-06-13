import Image from "next/image";
import { partners } from "../constants";
import styles from "../styles/style";



const Partners = () => (
  <div className={`${styles.boxWidth} my-5`}>
    <h6 className={`${styles.heading2} text-center font-bangla `}>
      আমাদের পার্টনার
    </h6>
    <div className="flex flex-wrap my-10 justify-around " data-aos="fade-up">
      {partners.map((item) => (
        <div
          key={item.des}
          className="xs:w-[210px] xl:w-[240px]  m-2 rounded-lg   hover:cursor-pointer"
        >
          <div
            href={item.des}
            className="flex flex-col  justify-around items-center flex-wrap p-3 "
          >
            <Image
              className=" rounded-sm"
              src={item.img}
              alt={item.alt}
            />
            
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Partners;
