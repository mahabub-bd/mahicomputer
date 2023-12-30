import React from "react";
import styles from "../styles/style";
import { ContactForm } from ".";
import Image from "next/image";
import { email } from "@/public";




const Contact = () => {
  return (
    <div id="contact" className=" relative">
      <div className={`${styles.boxWidth}`}>
        <h2
          className={`${styles.heading2} text-center my-4 font-bangla`}
          data-aos="fade-up"
        >
          Have Any Query ?
        </h2>

        <div className="flex vxs:flex-col xl:flex-row lg:flex-row  py-4 px-4 gap-12   justify-around items-center ">
          <div className="w-full " data-aos="fade-right">
            <p className=" text-[18px] font-bangla py-3  border-b-2 ">
              <span className="text-blue-500">
                Email Us : <br />{" "}
                
              </span>

              <a className="text-[16px]" href="mailto:info@mahicomputerbd.com">
                info@mahicomputerbd.com
              </a>
            </p>
            <p className=" text-[18px] font-bangla py-3 border-b-2 ">
              {" "}
              <span className="text-blue-500">
                Make A Call: <br />{" "}
              </span>{" "}
              +8801711102944
            </p>
            <p className=" text-[18px] font-bangla py-3 border-b-2  ">
              <span className="text-blue-500">
                Corporate Ofiice: <br />{" "}
              </span>{" "}
              Ka-65 Shahajadpur, Gulshan, Dhaka-1212
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
