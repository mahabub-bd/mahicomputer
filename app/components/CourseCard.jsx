import { lessonimg, rating, signal, day } from "@/public";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CourseCard = ({
  courseImg,
  courseImgalt,
  link,
  tag,
  tagbg,
  title,
  lesson,
  duration,
  instractorName,
  instractorphoto,
  price,
}) => {
  return (
    /* courseImage, alt,link, tag,title,lesson,duration,instractorname,photo,price*/

      <div className="shadow-2xl rounded-md  hover:scale-95 cursor-pointer">
        <div>
          <Image src={courseImg} className="w-[360px]  " alt={courseImgalt} />
        </div>
        <div className="flex justify-between items-center p-2 mt-2 ">
          <p className="text-[14px]">
            <Image
              src={rating}
              className="w-[14px] inline mr-2"
              alt="rating_image"
            />
            4.9/31
          </p>
          <Link
            href={link}
            className={`${tagbg} text-white  font-light rounded-md px-2 py-1  text-[14px]`}
          >
            {tag}
          </Link>
        </div>
        <div>
          <p className="text-center font-semibold text-[20px] text-blue-700">
            {title}
          </p>
        </div>
        <div className="flex justify-between items-center my-2  border-b-[1px] px-2 py-2 ">
          <div className="flex items-center justify-between">
            <Image src={lessonimg} className="w-[16px] h-[16px]" alt="lesson" />
            <p className="text-[14px] ml-2">{lesson} Lessons</p>
          </div>
          <div className="flex items-center justify-between">
            <Image src={day} className="w-[16px] h-[16px]" alt="day" />
            <p className="text-[14px] ml-2">{duration} Month</p>
          </div>
          <div className="flex items-center justify-between">
            <Image src={signal} className="w-[16px] h-[16px]" alt="signal" />
            <p className="text-[14px] ml-2">Begineer</p>
          </div>
        </div>
        <div className="flex justify-between items-center p-2">
          <div className="flex justify-between items-center  ">
            <Image
              src={instractorphoto}
              className="w-[40px] h-[40px] rounded-full"
              alt="instractor_photo"
            />
            <p className="text-[14px] font-normal ml-3">{instractorName}</p>
          </div>

          <h6 className="text-[24px] font-semibold text-qpayone">
            BDT {price}
          </h6>
        </div>
      </div>
    
  );
};

export default CourseCard;
