"use client";

import AOS from "aos";
import "aos/dist/aos.css";


import { useEffect } from "react";
import { Carousel, Hero, Marquee, Stats } from "./components";

const HomePage = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className=" w-full overflow-hidden ">
      <Marquee/>
     
      <Hero/>
      <Stats/>
    </div>
  );
};

export default HomePage;
