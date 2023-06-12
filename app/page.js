"use client";

import AOS from "aos";
import "aos/dist/aos.css";

import { useEffect } from "react";
import {
  About,
  Categories,
  Courses,
  Hero,
  Instractor,
  Map,
  Marquee,
  Review,
  Stats,
} from "./components";

const HomePage = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className=" w-full overflow-hidden ">
      <Marquee />

      <Hero />
      <About />
      <Stats />
      <Categories />
      <Courses />
      <Instractor />
      <Review />
      <Map />
    </div>
  );
};

export default HomePage;
