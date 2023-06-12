import React from "react";
import styles from "../styles/style";

const Contact = () => {
  return (
    <div id="courses">
      <div className={`${styles.boxWidth}`}>
        <h2 className={`${styles.heading2} text-center my-4 font-bangla`}>
          আমাদের সাথে যোগাযোগ করুন
        </h2>

        <div className="flex flex-wrap my-10 gap-8 justify-around">
          <div className="flex-1">
            <h6 className="font-bangla text-[18px]">
              আপনার প্রতিক্রিয়া, অভিযোগ এবং পরামর্শের জন্য আমাদের সাথে যোগাযোগ
              করুন.
            </h6>
          </div>
          <div className="flex-1">
            Contact
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
