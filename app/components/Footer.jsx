"use client";
import { logodark, email, phone, location } from "@/public";
import Image from "next/image";
import Link from "next/link";
import { footerLinks, socialMedia } from "../constants";
import styles from "../styles/style";

const Footer = () => {
  return (
    <>
      <section
        className={`${styles.flexCenter} ${styles.paddingY} flex-col bg-[#131A22] xl:px-0 sm:px-16 px-6 relative`}
      >
        <div
          className={`${styles.flexStart} ${styles.boxWidth}  md:flex-row flex-col mb-5 w-full`}
        >
          <div className="flex flex-1 flex-col w-full xl:justify-start  lg:justify-start  lg:items-start xl:items-start vxs:justify-center vxs:items-center mr-10  md:w-full">
            <Link href="/">
              <Image
                src={logodark}
                alt="footer__logo"
                className="w-[166px] md:w-[80px]xs:w-[60px] h-[72px] object-contain"
                priority
              />
            </Link>

            <div
              className={`${styles.paragraph} mt-2 max-w-[310px] text-white flex`}
            >
              <Image src={phone} alt="phone_icon" className="w-[18px] mr-3" />
              <a className=" text-[16px]" href="tel:+8801711102944">
                +8801711102944
              </a>
            </div>
            <div
              className={`${styles.paragraph} mt-2 max-w-[310px] text-white flex`}
            >
              <Image src={email} alt="phone_icon" className="w-[18px] mr-3" />
              <a className="text-[16px]" href="mailto:info@mahicomputerbd.com">
                info@mahicomputerbd.com
              </a>
            </div>
            <div
              className={`${styles.paragraph} mt-2 max-w-[400px] text-white flex`}
            >
              <Image
                src={location}
                alt="location_icon"
                className="w-[18px] mr-3"
              />
              <a className="text-[16px]">
                Ka-65 Shahajadpur, Gulshan, Dhaka-1212
              </a>
            </div>
          </div>
          <div className="flex-1 flex w-full flex-row justify-between  flex-wrap md:mt-0 mt-10">
            {footerLinks.map((footerLink) => (
              <div
                key={footerLink.id}
                className="flex flex-col ss:my-0 my-4 min-w-[150px]"
              >
                <h4 className="font-poppins font-medium text-[18px] leading-[27px] text-white">
                  {footerLink.title}
                </h4>
                <ul key={footerLink.id} className="list-none mt-4">
                  {footerLink.links.map((Link, index) => (
                    <li
                      key={Link.id}
                      className={`font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-qpayone cursor-pointer
                  
                  ${index !== footerLink.links.length - 1 ? "mb-4" : "mb-0"}
                  `}
                    >
                      <a href={Link.link}> {Link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div
          className={`${styles.boxWidth}  flex items-center justify-between vxs:flex-col-reverse lg:flex-row-reverse xl:flex-row-reverse   pt-6 border-t-[1px] border-t-[#3F3E45]`}
        >
          <p className="font-poppins font-light text-[14px] leading-[27px] text-white vxs:mt-4 xl:mt-0">
            © 2023 Mahi Computer All Rights Reserved
          </p>

          <div className="flex flex-row  md:mt-4 mt-6 md:justify-center  xl:justify-end ">
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
                  className={`w-[21px] h-[21px] object-contain `}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Footer;
