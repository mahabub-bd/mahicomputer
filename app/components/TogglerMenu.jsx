"use client";

import { close, menu } from "@/public";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useState } from "react";

import styles from "../styles/style";

const TogglerMenu = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <div className="sm:hidden flex flex-1 justify-end items-center relative">
      <Image
        src={toggle ? close : menu}
        alt="menu"
        className="w-[28px] h-[28px] cursor-pointer object-contain"
        onClick={() => setToggle((prev) => !prev)}
      />

      <div
        className={`${
          toggle ? "flex" : "hidden"
        } p-6 bg-black-gradient absolute top-20 right-0 mx-6 my-2 min-w-[200px] rounded-xl sidebar z-50 `}
      >
        <ul className=" list-none flex  flex-col  flex-1">
          <Link className={`${styles.mobileMenu} `} href={`/`} scroll={false}>
            হোম
          </Link>

          <Link
            className={`${styles.mobileMenu} relative `}
            href={`#about`}
            scroll={false}
          >
            আমাদের সম্পর্কে
          </Link>

          <Link
            className={`${styles.mobileMenu}`}
            href={`/#categories`}
            scroll={false}
          >
            সেবা সমূহ
          </Link>

          <Link
            className={`${styles.mobileMenu}`}
            href={`/#courses`}
            scroll={false}
          >
            কোর্স সমূহ
          </Link>

          <Link className={`${styles.mobileMenu} `} href={`/#reviw`}>
            স্টুডেন্ট ফিডব্যাক
          </Link>

          <Link
            className={`${styles.mobileMenu}`}
            href={`/#blog`}
            scroll={false}
          >
            ব্লগ
          </Link>

          <Link
            className={`${styles.mobileMenu}`}
            href={`/#gallary`}
            scroll={false}
          >
            ছবি গ্যালারী
          </Link>

          <Link
            className={`${styles.mobileMenu}`}
            href={`/#contact`}
            scroll={false}
          >
            যোগাযোগ
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default TogglerMenu;
