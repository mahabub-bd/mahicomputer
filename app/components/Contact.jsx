import React from "react";
import styles from "../styles/style";
import { ContactForm } from ".";

const Contact = () => {
  return (
    <div id="contact" className=" relative">
      <div className={`${styles.boxWidth}`}>
        <h2 className={`${styles.heading2} text-center my-4 font-bangla`}>
          আমাদের সাথে যোগাযোগ করুন
        </h2>

        <div className="flex vxs:flex-col xl:flex-row lg:flex-row  py-4 px-4 gap-12   justify-around items-center ">
          <div className="w-full " data-aos="fade-right">
            <p className="font-bangla text-[20px] leading-normal">
              আপনার প্রতিক্রিয়া, অভিযোগ এবং পরামর্শের জন্য আমাদের সাথে যোগাযোগ
              করুন
            </p>
            <p className=" text-[18px] font-bangla leading-normal">
              মোবাইল নাম্বার - 01711102944
            </p>
            <p className=" text-[18px] font-bangla leading-normal">
              ক-৬৫, শাহাজাদপুর, গুলশান ,ঢাকা
            </p>
          </div>
          <div className="w-full " data-aos="fade-left">
            <ContactForm />
          </div>
        </div>
      </div>
      <div className=" absolute shape-1"></div>
      <div className=" absolute shape-2"></div>
      <div className=" absolute shape-3"></div>
    </div>
  );
};

export default Contact;
