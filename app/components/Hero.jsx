import React from "react";
import styles, { layout } from "../styles/style";

import Image from "next/image";

import { Button } from "../components";
import { paymentapp } from "@/public";

const Hero = () => {
  return (
    <div className="bg-mahitwo">
      <div className={`${styles.boxWidth}  `}>
        <section className={`${layout.section}xl:px-0 md:px-4  `}>
          <div className={`${layout.sectionInfo}  md:items-start md:px-2 xl:px-0`}>
            <h2 className={`${styles.heading2} text-white`}>
              Boost up your <span className="text-[#FFB802]">skills</span> .{" "}
              <br className="sm:block hidden" /> Grab your course, <br /> Right
              Now
            </h2>
            <p className={`${styles.paragraph} max-w-[470px] mt-5 text-white`}>
              Arcu tortor, purus in mattis at sed integer faucibus. Aliquet quis
              aliquet eget mauris tortor.ç Aliquet ultrices ac, ametau.
            </p>
            <Button styles="mt-10 " />
          </div>
          <div className={`${layout.sectionImg} text-white flex-col`}>
            <Image
              src={paymentapp}
              alt="card"
              className="w-[100%] h-[100%] rounded-[20px]"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hero;



