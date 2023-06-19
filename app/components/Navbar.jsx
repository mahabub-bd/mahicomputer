"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { logo } from "../../public";
import { MegaMenu, PreHeader, TogglerMenu } from "../components";
import { navLinks, courses } from "../constants";
import useScroll from "../hooks/useScroll";
import styles from "../styles/style";

const Navbar = () => {
  const [active, setActive] = useState("Home");

  const { scrolled } = useScroll();

  return (
    <>
    <PreHeader/>
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
              className="w-[130px] h-[62px] object-contain"
              priority
            />
          </Link>
          <ul
            className={`list-none sm:flex hidden items-center justify-center flex-1`}
          >
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={` ${
                  nav.class
                } font-bold nav-font cursor-pointer text-[16px]  relative ${
                  active === nav.title ? "text-blue-700 " : "text-black"
                } [&:not(:last-child)]:mr-10`}
                onClick={() => setActive(nav.title)}
              >
                <Link href={`/${nav.id}`}>{nav.title}</Link>

                <MegaMenu
                  menuLink={courses}
                  menu="courses"
                  menuName="features-mega-menu"
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
