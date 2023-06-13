"use client";

import AOS from "aos";
import "aos/dist/aos.css";

import { useEffect } from "react";
import {
  About,
  Categories,
  Courses,
  Contact,
  Hero,
  Instractor,
  Map,
  Marquee,
  Review,
  Stats,
  Gallery,
  Partners,
} from "./components";

const HomePage = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className=" w-full overflow-hidden scroll-smooth ">
      <Marquee />

      <Hero />
      <About />
      <Stats />
      <Categories />
      <Courses />
      <Instractor />
      <Review />
      <Gallery />
      <Partners />
      <Contact />
      <Map />
    </div>
  );
};

export default HomePage;
