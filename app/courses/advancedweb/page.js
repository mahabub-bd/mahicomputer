import { instractor, courses } from "@/app/constants";
import styles from "@/app/styles/style";
import { advancedweb,  instractor6,  } from "@/public";
import Image from "next/image";
import React from "react";

const webdesign = () => {
  return (
    <div>
      <div className={`${styles.boxWidth} $${styles.paddingY}`}>
        <h1 className={`${styles.heading3} text-blue-700 text-3xl my-6`}>
          Course Name : Web Development
        </h1>
        <div className="flex my-4 md:flex-row flex-col justify-between items-center">
          <div className=" p-3">
            <Image
              src={advancedweb}
              className="w-[600px] shadow-lg"
              alt="office"
            />
          </div>

          <div className="  max-w-xl xl:px-0 md:px-3">
            <p className={`${styles.paragraph} text-justify`}>
              A Web Designer designs the entire navigation system of a website,
              text, files, images, audio, video where it will be. So to become a
              skilled web designer requires long term practice under quality
              organization.
            </p>
            <p className={`${styles.paragraph} text-justify`}>
              That why our web design course is designed to combine coding and
              creativity. Here every subject is taught by hand in class.
              Moreover, homework or practice work will familiarize you with the
              whole process. As a result, at the end of the course, you will be
              able to design a professional website yourself. And this certified
              web design course will serve as a reminder of your skills in your
              career.
            </p>
          </div>
        </div>
        <div className="flex  mx-auto w-full my-4  items-center md:flex-row flex-col  justify-around ">
          <div className="bg-[#faf9fd] rounded-3xl p-3 flex-1 ">
            <h2 className="text-[20px] text-blue-700 py-3 m-2">
              Inside This Course
            </h2>
            <ul class="list-disc list-inside ">
              <li className="p-2">HTML5</li>
              <li className="p-2">CSS3</li>
              <li className="p-2">Bootstrap</li>
              <li className="p-2">Tailwind CSS</li>

              <li className="p-2">Javascript</li>
              <li className="p-2">Figma</li>
              <li className="p-2">React</li>
            </ul>
          </div>
          <div className="flex-1  p-4 m-3">
            <div className=" flex flex-col justify-center items-center">
              <h2 className="text-[24px] py-3 text-blue-700 text-center">
                Instractor Details
              </h2>
              <div className="flex justify-around items-center ">
                <Image
                  src={instractor6}
                  className="w-[70px] rounded-full h-[70px] shadow-lg"
                  alt="instractor"
                />

                <div className="flex flex-col ml-5">
                  <p className="font-semibold text-[18px] font-plusjakarta text-blue-700 ">
                    {instractor[2].name}
                  </p>
                  <p>{instractor[2].des}</p>
                </div>
              </div>

              <div>
                <table className="border-collapse border border-slate-400 text-center">
                  <caption class="caption-top my-3 text-[24px] py-3 text-blue-700 text-center">
                    Course Details
                  </caption>

                  <tbody>
                    <tr>
                      <td className="border px-3 border-slate-300">
                        Course Fee
                      </td>
                      <td className="border px-3 border-slate-300">
                        {courses[1].price}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-3 border-slate-300">
                        Course Duration
                      </td>
                      <td className="border px-3 border-slate-300">6 Month</td>
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
                        HTML , CSS Basic Knowladge
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-3 border-slate-300">
                        Total Seat
                      </td>
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
    </div>
  );
};

export default webdesign;
