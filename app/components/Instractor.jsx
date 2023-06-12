import React from "react";
import styles from "../styles/style";
import Image from "next/image";


import { instractor} from "../constants";

const Instractor = () => {
  return (
    <div className={`${styles.boxWidth} my-5`}>
      <h2 className={`${styles.heading2} text-center my-4 font-bangla`}>
        কোর্স ইন্সট্রাক্টর
      </h2>
    
      <div className="flex flex-wrap my-10 justify-around " data-aos="fade-up">
        {instractor.map((item) => (
          <div
            key={item.des}
            className="xs:w-[210px] xl:w-[240px]  m-2 rounded-lg   hover:cursor-pointer"
          >
            <div
              href={item.des}
              className="flex flex-col  justify-around flex-wrap p-3 "
            >
              <Image
                className="w-[240px] h-[270px] rounded-sm"
                src={item.img}
                alt={item.alt}
              />
              <h3 className="text-mahitwo  mt-5 font-bold text-[20px]">
                {item.name}
              </h3>
              <h4 className="text-mahithree  mt-2  text-[16px]">{item.des}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instractor;
