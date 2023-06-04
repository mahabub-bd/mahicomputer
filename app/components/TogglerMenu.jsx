"use client";

import { close, menu } from "@/public";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useState } from "react";

import { MobileSubMenu } from "../components";
import styles from "../styles/style";
import { helpMenuLink, featuresList } from "../constants";

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
          <Link
            className={`${styles.mobileMenu} `}
            href={`/`}
            scroll={false}
          >
            Home
          </Link>

          <Link
            className={`${styles.mobileMenu} relative `}
            href={`/`}
            scroll={false}
          >
            Features
            <MobileSubMenu menuLink={featuresList} menu="features" />
          </Link>

          <Link
            className={`${styles.mobileMenu}`}
            href={`/#banks`}
            scroll={false}
          >
            Bank & FI
          </Link>

          <Link
            className={`${styles.mobileMenu}`}
            href={`/#boothlist`}
            scroll={false}
          >
            ATM Booth
          </Link>

          <Link className={`${styles.mobileMenu} relative`} href={`/`}>
            Help
            <MobileSubMenu menuLink={helpMenuLink} menu="help" />
          </Link>

          <Link
            className={`${styles.mobileMenu}`}
            href={`/#download`}
            scroll={false}
          >
            Qpay App
          </Link>

          <Link
            className={`${styles.mobileMenu}`}
            href={`/#about`}
            scroll={false}
          >
            About
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
