"use client";

import Link from "next/link";
import React, { useState } from "react";

import Image from "next/image";
import { downarrow, uparrow } from "@/public";
import styles from "../styles/style";
const MobileSubMenu = ({ menuLink ,menu}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="  ">
      <Image
        src={!isOpen ? downarrow : uparrow}
        alt="menu"
        className={`w-[12px] top-[7px] left-[105px] cursor-pointer object-contain absolute`}
        onClick={() => setIsOpen((prev) => !prev)}
      />

      {isOpen && (
        <div className=" mt-2">
          {menuLink.map((item) => (
            <div key={item.id}>
              <ul className=" list-none flex  flex-col  flex-1">
                <Link
                  href={`/${menu}${item.link}`}
                  className={`${styles.mobileMenu} ml-6`}
                  scroll={false}
                >
                  {item.title}
                </Link>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileSubMenu;
