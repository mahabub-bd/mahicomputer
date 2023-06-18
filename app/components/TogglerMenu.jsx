"use client";

import { close, menu } from "@/public";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useState } from "react";

import { MobileSubMenu } from "../components";
import styles from "../styles/style";
import {  courses, featuresList } from "../constants";

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
            Home
          </Link>

          <Link
            className={`${styles.mobileMenu} `}
            href={`/#about`}
            scroll={false}
          >
            About
          </Link>

          <Link
            className={`${styles.mobileMenu}`}
            href={`/#categories`}
            scroll={false}
          >
            Services
          </Link>

          <Link
            className={`${styles.mobileMenu} relative `}
            href={`/#courses`}
            scroll={false}
          >
            Courses
            <MobileSubMenu menuLink={courses} menu="courses" />
          </Link>

          <Link className={`${styles.mobileMenu}`} href={`#review`}>
            Feedback
          </Link>

          <Link
            className={`${styles.mobileMenu}`}
            href={`/#blog`}
            scroll={false}
          >
            Blog
          </Link>

          <Link
            className={`${styles.mobileMenu}`}
            href={`/#gallery`}
            scroll={false}
          >
            Gallery
          </Link>

          <Link
            className={`${styles.mobileMenu}`}
            href={`/#contact`}
            scroll={false}
          >
            Contact
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default TogglerMenu;
