"use client";

import AOS from "aos";
import "aos/dist/aos.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
  CEO,
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
      <CEO />
      <Categories />
      <Courses />
      <Instractor />
      <Review />
      <Stats />
      <Gallery />
      <Partners />
      <Contact />
      <Map />
    </div>
  );
};

export default HomePage;
