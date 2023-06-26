import { courses, instractor } from "@/app/constants";
import styles from "@/app/styles/style";
import { autocadprogram, instractor1, instractor3, officeapplication } from "@/public";
import Image from "next/image";
import React from "react";

const autocad = () => {
  return (
    <div className={`${styles.boxWidth} $${styles.paddingY}`}>
      <h1 className={`${styles.heading3} text-blue-700 text-3xl my-6`}>
        Course Name : Auto Cad 2D/3D
      </h1>
      <div className="flex my-4 md:flex-row flex-col justify-between items-center">
        <div className=" p-3">
          <Image
            src={autocadprogram}
            className="w-[600px] shadow-lg"
            alt="office"
          />
        </div>

        <div className="  max-w-xl xl:px-0 md:px-3">
          <p className={`${styles.paragraph} text-justify`}>
            AutoCAD is a leading software program used in various industries for
            computer-aided design (CAD) and drafting. It offers powerful tools
            for creating precise 2D and 3D models, making it a fundamental skill
            for architects, engineers, designers, and drafters. An AutoCAD 2D
            and 3D course modular provides a structured and comprehensive
            learning path to master the intricacies of this versatile software.
            In this article, we will explore the key modules of an AutoCAD
            course, highlighting the skills and knowledge gained at each stage.
          </p>
          <p className={`${styles.paragraph} text-justify`}>
            So, enroll in Mahi Computer Institute “AutoCAD Course” today to
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
              Introduction to AutoCAD: The course begins with an introduction to
              AutoCAD, familiarizing participants with the software interface,
              navigation, and basic commands. They learn essential skills such
              as drawing lines, circles, arcs, and rectangles, using precision
              tools, and organizing drawings with layers. This module serves as
              the foundation for subsequent modules and helps participants build
              confidence in using AutoCAD.
            </li>
            <li className="p-2">
              2D Drawing and Editing: The second module focuses on 2D drawing
              and editing techniques. Participants learn to create complex
              geometries using advanced commands like offset, trim, extend,
              fillet, and chamfer. They explore methods for drawing precise
              dimensions, adding text annotations, and creating reusable blocks.
              This module enhances participants ability to create accurate and
              detailed 2D drawings.
            </li>
            <li className="p-2">
              2D Design and Documentation: In this module, participants dive
              into more advanced 2D design and documentation. They learn to use
              hatch patterns, gradients, and linetypes to enhance drawings. The
              module covers techniques for creating sections, elevations, and
              construction details. Participants also gain proficiency in
              dimensioning, creating and managing layouts, and generating plots
              and printouts. This module equips participants with the skills
              needed to produce professional-quality 2D designs and
              documentation.
            </li>
            <li className="p-2">
              Introduction to 3D Modeling: The course then progresses to the 3D
              modeling module, where participants explore the world of 3D
              design. They learn to create solid and surface models using
              commands such as extrude, revolve, sweep, and loft. Participants
              understand the principles of creating complex 3D objects and
              manipulating them in 3D space. This module expands their design
              capabilities beyond 2D and introduces them to the realm of 3D
              visualization.
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
                src={instractor1}
                className="w-[70px] rounded-full h-[70px] shadow-lg"
                alt="office"
              />

              <div className="flex flex-col ml-5">
                <p className="font-semibold text-[18px] font-plusjakarta text-blue-700 ">
                  {instractor[0].name}
                </p>
                <p>{instractor[0].des}</p>
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

export default autocad;
