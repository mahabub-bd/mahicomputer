import React from "react";
import styles from "../styles/style";
import { ContactForm } from ".";

const Contact = () => {
  return (
    <div id="courses">
      <div className={`${styles.boxWidth}`}>
        <h2 className={`${styles.heading2} text-center my-4 font-bangla`}>
          আমাদের সাথে যোগাযোগ করুন
        </h2>

        <div className="flex xs:flex-col xl:flex-row lg:flex-row  py-4   justify-around items-center">
          <div className="flex-1">
            <p className="font-bangla text-[18px]">
              আপনার প্রতিক্রিয়া, অভিযোগ এবং পরামর্শের জন্য আমাদের সাথে যোগাযোগ
              করুন.
            </p>
            <p className=" text-[18px] font-bangla">
              মোবাইল নাম্বার -  01711102944 
            </p>
          </div>
          <div className="flex-1">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
