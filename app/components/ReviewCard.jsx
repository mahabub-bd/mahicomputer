import { rating } from "@/public";
import Image from "next/image";
import React from "react";


const ReviewCard = ({ name, title, content, img }) => {
  return (
    <div className="flex  justify-around flex-col px-5 py-5 rounded-[20px] max-w-[380px] md:mr-10 sm:mr-5  mr-0 my-5 shadow-2xl ">
      <div className="flex justify-between items-center">
        <Image src={rating} alt="quote" className=" w-[24px] object-contain" />
        <p>
         
          <span className="font-semibold mr-2">4.8</span>Rating For Auto Cad
        </p>
      </div>
      <p
        className={`  font-light text-justify text-[14px] leading-[21px]  my-4`}
      >
        {content}
      </p>
      <div className="flex flex-row justify-between items-center mt-5">
        <Image
          src={img}
          alt="prifile "
          className="w-[58px] h-[58px] object-contain rounded-full"
        />
        <div className="flex flex-col ml-4">
          <h6 className=" font-bold text-[20px] leading-[32px]">{name}</h6>
          <p className="font-normal text-[16px] leading-[24px] text-blue-900 opacity-80 mt-2 ">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
