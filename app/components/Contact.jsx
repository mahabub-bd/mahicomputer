import React from "react";
import styles from "../styles/style";
import { ContactForm } from ".";

const Contact = () => {
  return (
    <div id="contact" className=" relative">
      <div className={`${styles.boxWidth}`}>
        <h2
          className={`${styles.heading2} text-center my-4 font-bangla`}
          data-aos="fade-up"
        >
          আমাদের সাথে যোগাযোগ করুন
        </h2>

        <div className="flex vxs:flex-col xl:flex-row lg:flex-row  py-4 px-4 gap-12   justify-around items-center ">
          <div className="w-full " data-aos="fade-right">
            <p className="font-bangla text-[20px] leading-normal">
              আপনার প্রতিক্রিয়া, অভিযোগ এবং পরামর্শের জন্য আমাদের সাথে যোগাযোগ
              করুন
            </p>

            <p className=" text-[24px] font-bangla mt-3 text-blue-500 ">
              মাহি কম্পিউটার এবং ট্রেনিং সেন্টার
            </p>
            <p className=" text-[18px] font-bangla mt-3 ">
              মোবাইল নাম্বার - 01711102944
            </p>
            <p className=" text-[18px] font-bangla mt-3 ">
              ক-৬৫, শাহাজাদপুর, গুলশান ,ঢাকা
            </p>
          </div>
          <div className="w-full " data-aos="fade-left">
            <ContactForm />
          </div>
        </div>
      </div>

      <div className=" sm:flex hidden lg:block absolute shape-3"></div>
    </div>
  );
};

export default Contact;
