"use client";
import Image from "next/image";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { slides } from "../constants";
import useCarousel from "../hooks/useCarousel";

function Carousel() {
  const { currentIndex, prevSlide, nextSlide } = useCarousel();

  return (
    <div className="m-auto relative group   w-[100%]">
      <Image
        className="hidden md:block object-cover  w-full h-full"
        alt={`carouselimage${currentIndex}`}
        data-src={slides[currentIndex].url}
        src={slides[currentIndex].url}
        priority
      />

      <Image
        className=" block md:hidden object-cover  aspect-2x1  w-full h-full"
        alt={`carouselimage${currentIndex}`}
        data-src={slides[currentIndex].mobileurl}
        src={slides[currentIndex].mobileurl}
        priority
      />

      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 z-10 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactLeft onClick={prevSlide} size={16} />
      </div>
      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl    z-10 rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactRight onClick={nextSlide} size={16} />
      </div>
    </div>
  );
}

export default Carousel;
