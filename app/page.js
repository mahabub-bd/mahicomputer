"use client";

import AOS from "aos";
import "aos/dist/aos.css";


import { useEffect } from "react";
import { Categories, Courses, Hero, Instractor, Marquee, Review, Stats } from "./components";
import { Rating } from "flowbite-react";

const HomePage = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className=" w-full overflow-hidden ">
      <Marquee/>
     
      <Hero/>
      <Stats/>
      <Categories/>
      <Courses/>
      <Instractor/>
     <Review/>
    </div>
  );
};

export default HomePage;
