
import { courses, instractor } from "@/app/constants";
import styles from "@/app/styles/style";
import {  instractor1, instractor5, sketch, } from "@/public";
import Image from "next/image";
import React from "react";

const sketchup = () => {
  return (
    <div className={`${styles.boxWidth} $${styles.paddingY}`}>
      <h1 className={`${styles.heading3} text-blue-700 text-3xl my-6`}>
        Cousrse Name : Sketch Up 3D Design
      </h1>
      <div className="flex my-4 md:flex-row flex-col justify-between items-center">
        <div className=" p-3">
          <Image
            src={sketch}
            className="w-[600px] h-[400px] shadow-lg"
            alt="office"
          />
        </div>

        <div className="  max-w-xl xl:px-0 md:px-3">
          <p className={`${styles.paragraph} text-justify`}>
            Mahi Training SketchUp 3D is a powerful and user-friendly 3D
            modeling software that has revolutionized the world of design and
            visualization. Whether you are an architect, interior designer,
            engineer, or hobbyist, SketchUp provides an intuitive platform for
            creating and manipulating 3D models. In this article, we will
            explore the features and benefits of SketchUp 3D and how it empowers
            users to bring their ideas to life.
          </p>
          <p className={`${styles.paragraph} text-justify`}>
            So, enroll in Mahi Computer Institute “SketchUp 3D Course” today to
            enhance your skills and increase your efficiency.
          </p>
        </div>
      </div>
      <div className="flex  mx-auto w-full my-4  items-center md:flex-row flex-col  justify-around ">
        <div className="bg-[#faf9fd] rounded-3xl p-3 flex-1 ">
          <h2 className="text-[20px] text-blue-700 py-3 m-2">
            Inside This Course
          </h2>
          <ul class="list-disc list-inside ">
            <li className="p-2">
              Intuitive Interface and Ease of Use: One of the standout features
              of SketchUp 3D is its intuitive interface, which makes it
              accessible to both beginners and professionals. The software uses
              a simple approach that allows users to create and edit 3D models
              effortlessly. With its user-friendly tools and commands,
              navigating through the virtual space becomes a seamless
              experience, enabling users to focus on their creative process
              rather than getting bogged down by technical complexities.
            </li>
            <li className="p-2">
              Versatility and Wide Range of Applications: SketchUp 3D caters to
              a diverse range of industries and applications. Architects can use
              it to create detailed building designs and visualize spaces in 3D,
              while interior designers can utilize it to plan room layouts,
              experiment with materials, and showcase their vision to clients.
              Engineers can employ SketchUp for creating prototypes and
              simulating real-world scenarios, while hobbyists and enthusiasts
              can explore their creativity by designing objects, landscapes, and
              even entire
            </li>
            <li className="p-2">
              Robust Modeling Tools and Features: SketchUp 3D provides a rich
              set of modeling tools that empower users to create intricate 3D
              models with ease. From basic geometric shapes to complex
              structures, SketchUp offers tools for drawing, extruding, pushing,
              pulling, and manipulating objects in 3D space. Users can
              accurately model architectural elements, furniture, vehicles, and
              other intricate details, thanks to features such as snapping,
              inference, and dimensioning tools.
            </li>
            <li className="p-2">
              Dynamic Component System: One of the standout features of SketchUp
              3D is its dynamic component system. This feature allows users to
              create intelligent and interactive models that respond to changes
              in parameters or properties. For example, a dynamic door component
              can be programmed to open and close with a click, or a dynamic
              furniture component can be adjusted in size and configuration.
              This flexibility enables users to create realistic and interactive
              visualizations, enhancing the overall design experience
            </li>
          </ul>
        </div>
        <div className="flex-1  p-4 m-3">
          <div className=" flex flex-col justify-center items-center">
            <h2 className="text-[20px] py-3 text-blue-700 text-center">
              Instractor Details
            </h2>
            <div className="flex justify-around items-center ">
              <Image
                src={instractor5}
                className="w-[70px] rounded-full h-[70px] shadow-lg"
                alt="office"
              />

              <div className="flex flex-col ml-5">
                <p className="font-semibold text-[18px] font-plusjakarta text-blue-700 ">
                  {instractor[5].name}
                </p>
                <p>{instractor[5].des}</p>
              </div>
            </div>

            <div>
              <table className="border-collapse border border-slate-400 text-center">
                <caption class="caption-top my-3 text-[24px] py-3 text-blue-700 text-center">
                  Course Details
                </caption>

                <tbody>
                  <tr>
                    <td className="border px-3 border-slate-300">Course Fee</td>
                    <td className="border px-3 border-slate-300">
                      {courses[2].price}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-3 border-slate-300">
                      Course Duration
                    </td>
                    <td className="border px-3 border-slate-300">3 Month</td>
                  </tr>
                  <tr>
                    <td className="border px-3 border-slate-300">
                      Number Of Class
                    </td>
                    <td className="border px-3 border-slate-300">36</td>
                  </tr>
                  <tr>
                    <td className="border px-3 border-slate-300">
                      Pre-requisite
                    </td>
                    <td className="border px-3 border-slate-300">
                      Basic English Knowledge
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-3 border-slate-300">Total Seat</td>
                    <td className="border px-3 border-slate-300">
                      10 students per batch.
                    </td>
                  </tr>
                </tbody>
              </table>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default sketchup;
