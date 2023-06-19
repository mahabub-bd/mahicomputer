import Image from "next/image";
import Link from "next/link";

const MegaMenu = ({ menuLink, menu, menuName }) => {
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
