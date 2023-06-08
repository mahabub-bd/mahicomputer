"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { logo, phone, email } from "../../public";
import { MegaMenu, TogglerMenu } from "../components";
import {
  featuresList,
  navLinks,
  helpMenuLink,
  socialMedia,
} from "../constants";
import useScroll from "../hooks/useScroll";
import styles from "../styles/style";

const Navbar = () => {
  const [active, setActive] = useState("Home");

  const { scrolled } = useScroll();

  return (
    <>
      <div
        className={` border-b-[1px] border-b-[#feeacd] sm:flex hidden bg-[#07294D]`}
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
                  className={`w-[18px] h-[18px] object-contain `}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`relative mx-auto  bg-white ${
          scrolled && "sticky drop-shadow-lg"
        }`}
        id="home"
      >
        <nav
          className={`${styles.boxWidth}  mx-auto flex px-3 py-2   sm:px-0 justify-between items-center`}
        >
          <Link href="/">
            <Image
              src={logo}
              alt="qpay__headerlogo"
              className="w-[150px] h-[62px] object-contain"
              priority
            />
          </Link>
          <ul
            className={`"list-none sm:flex hidden items-center justify-center flex-1"`}
          >
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={` ${
                  nav.class
                } font-poppins font-semibold cursor-pointer text-[16px] relative hover:border-b-2  hover:border-qpayone ${
                  active === nav.title ? "text-qpayone " : "text-black"
                } [&:not(:last-child)]:mr-10`}
                onClick={() => setActive(nav.title)}
              >
                <Link href={`/${nav.id}`}>{nav.title}</Link>

                <MegaMenu
                  menuLink={featuresList}
                  menu="features"
                  menuName="features-mega-menu"
                />
                <MegaMenu
                  menuLink={helpMenuLink}
                  menu="help"
                  menuName="help-mega-menu"
                />
              </li>
            ))}
          </ul>

          <TogglerMenu />
        </nav>
      </div>
    </>
  );
};

export default Navbar;
