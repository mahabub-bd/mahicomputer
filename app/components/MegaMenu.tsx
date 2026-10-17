import Link from "next/link";
import type { Course } from "../constants";

interface MegaMenuProps {
  menuLink: Course[];
  menu: string;
  menuName: string;
}

const MegaMenu = ({ menuLink, menu, menuName }: MegaMenuProps) => {
  return (
    <>
      <div
        className={`px-5 py-3   ${menuName} features-mega-menu  shadow-sm shadow-qpaytwo bg-white rounded-xl`}
      >
        <div className="container m-auto w-full flex  justify-between flex-col">
          {menuLink.map((item) => (
            <div key={item.title} className="flex pt-2 ">
              <Link
                href={`/${menu}/${item.link}`}
                className=" hover: text-black hover:text-blue-800"
              >
                <h6 className="mt-2 text-[16px]"> {item.title}</h6>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MegaMenu;
