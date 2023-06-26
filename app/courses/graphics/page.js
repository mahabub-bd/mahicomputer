


import { courses, instractor } from "@/app/constants";
import styles from "@/app/styles/style";
import { autocadprogram, graphicsdesign, instractor1, instractor3, instractor4, officeapplication } from "@/public";
import Image from "next/image";
import React from "react";

const graphics = () => {
  return (
    <div className={`${styles.boxWidth} $${styles.paddingY}`}>
      <h1 className={`${styles.heading3} text-blue-700 text-3xl my-6`}>
        Cousrse Name : Profesional Graphics Design
      </h1>
      <div className="flex my-3 md:flex-row flex-col justify-between items-center">
        <div className=" p-3">
          <Image
            src={graphicsdesign}
            className="w-[600px] shadow-lg"
            alt="office"
          />
        </div>

        <div className="  max-w-xl xl:px-0 md:px-3">
          <p className={`${styles.paragraph} text-justify`}>
            Graphics design is a modern, trending course in the job market. To
            make a concept come into reality companies need graphics design
            people to make visualization of their concept products. Graphics
            design jobs are also needed to make creative logos, designing
            brochures, flyers, newsletters; display banners ads, Website
            Mock-ups, etc. we hire creative and talented graphic designers as
            trainers for our courses. Our teaching method is helpful for even a
            complete beginner as our course cover from the very beginner level
            to the top advance level.
          </p>
          <p className={`${styles.paragraph} text-justify`}>
            We complete our course with a practical project in the end. After
            our class, a student can contact us for any further help & we also
            provide online help. so we are best for graphics design training in
            Dhaka Bangladesh. we use various tools for graphic design. students
            can learn very easy from our institute.
          </p>
        </div>
      </div>
      <div className="flex  mx-auto w-full my-4  items-center md:flex-row flex-col  justify-around ">
        <div className="bg-[#faf9fd] rounded-3xl p-3 flex-1 ">
          <h2 className="text-[20px] text-blue-700 py-3 m-2">
            Inside This Course
          </h2>
          <ul class="list-disc list-inside ">
            <li className="p-2">Introduction to Graphic Design</li>
            <li className="p-2">Typography and Layout</li>
            <li className="p-2">Color Theory and Application</li>
            <li className="p-2">Image Editing and Manipulation</li>
            <li className="p-2">Logo Design</li>
            <li className="p-2">Layout Design for Print</li>
            <li className="p-2">
              Design for Social Media and Digital Marketing
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
                src={instractor4}
                className="w-[70px] rounded-full h-[70px] shadow-lg"
                alt="office"
              />

              <div className="flex flex-col ml-5">
                <p className="font-semibold text-[18px] font-plusjakarta text-blue-700 ">
                  {instractor[4].name}
                </p>
                <p>{instractor[4].des}</p>
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

export default graphics;
