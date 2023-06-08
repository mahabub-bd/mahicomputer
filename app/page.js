"use client";

import AOS from "aos";
import "aos/dist/aos.css";


import { useEffect } from "react";
import { Categories, Courses, Hero, Marquee, Stats } from "./components";

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
    </div>
  );
};

export default HomePage;
