import Link from 'next/link';
import React from 'react'
import Image from "next/image";
import styles from "../styles/style";
import {  phone, email } from "../../public";
import { socialMedia } from '../constants';
const PreHeader = () => {
  return (
    <div
      className={` border-b-[1px] border-b-[#feeacd] sm:flex hidden bg-[#07294D] `}
    >
      <div className={`${styles.boxWidth} flex justify-between py-2 `}>
        <div className="flex ">
          <Image src={phone} alt="phone_icon" className="w-[16px]" />
          <span className="ml-2">
            <a
              className="font-light  text-slate-100 text-[18px]"
              href="tel:8801711102944"
            >
              +8801711102944
            </a>
          </span>
          <Image src={email} alt="phone_icon" className="w-[16px] ml-4" />
          <span className="ml-2">
            <a
              className=" text-[18px] text-slate-100 font-light"
              href="mailto: info@mahicomputerbd.com"
            >
              info@mahicomputerbd.com
            </a>
          </span>
        </div>
        <div className="flex flex-row items-center  ">
          {socialMedia.map((social) => (
            <Link
              key={social.id}
              href={social.link}
              className="cursor-pointer hover:text-qpayone [&:not(:last-child)]:mr-6 
                hover:opacity-80"
            >
              <Image
                src={social.icon}
                alt={social.id}
                className={`w-[22px] h-[22px] object-contain `}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PreHeader