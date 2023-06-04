"use client";

import AOS from "aos";
import "aos/dist/aos.css";


import { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div className=" w-full overflow-hidden ">
      <h1>Mahi</h1>
    
    </div>
  );
};

export default HomePage;
