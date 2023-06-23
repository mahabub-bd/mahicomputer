import { courses, instractor } from "@/app/constants";
import styles from "@/app/styles/style";
import { instractor3, officeapplication } from "@/public";
import Image from "next/image";
import React from "react";

const office = () => {
  return (
    <div className={`${styles.boxWidth} $${styles.paddingY}`}>
      <h1 className={`${styles.heading3} text-blue-700 text-3xl my-6`}>
        Course Name : Computer Office Application
      </h1>
      <div className="flex my-4 md:flex-row flex-col justify-between items-center">
        <div className=" p-3">
          <Image
            src={officeapplication}
            className="w-[600px] shadow-lg"
            alt="office"
          />
        </div>

        <div className="  max-w-xl xl:px-0 md:px-3">
          <p className={`${styles.paragraph} text-justify`}>
            Nowdays, computers are used in almost all fields due to the rise of
            information technology. Computer skills have become mandatory for
            almost everyone in education or the workplace, from superiors to
            subordinates. Typing skills in Bengali and English as well as
            knowledge of office software will boost your confidence
            tremendously.
          </p>
          <p className={`${styles.paragraph} text-justify`}>
            So, enroll in Mahi Computer Institute “Computer Office Application
            Course” today to enhance your skills and increase your efficiency.
            Take advantage of the free time you have especially after the SSC
            exam. “ Computer Office Application Course ” is a course of 3 months
            duration that includes detailed modules
          </p>
        </div>
      </div>
      <div className="flex  mx-auto w-full my-4  items-center md:flex-row flex-col  justify-around ">
        <div className="bg-[#faf9fd] rounded-3xl p-3 flex-1 ">
          <h2 className="text-[20px] text-blue-700 py-3 m-2">
            Inside This Course
          </h2>
          <ul class="list-disc list-inside ">
            <li className="p-2">COMPUTER FUNDAMENTAL</li>
            <li className="p-2">MICROSOFT WORD</li>
            <li className="p-2">MICROSOFT EXCEL AND ADVANCED EXCEL</li>
            <li className="p-2">MICROSOFT POWERPOINT</li>
            <li className="p-2">BANGLA & ENGLISH TYPING</li>
            <li className="p-2">INTERNET & EMAIL</li>
          </ul>
        </div>
        <div className="flex-1  p-4 m-3">
          <div className=" flex flex-col justify-center items-center">
            <h2 className="text-[20px] py-3 text-blue-700 text-center">
              Instractor Details
            </h2>
            <div className="flex justify-around items-center ">
              <Image
                src={instractor3}
                className="w-[70px] rounded-full h-[70px] shadow-lg"
                alt="office"
              />

              <div className="flex flex-col ml-5">
                <p className="font-semibold text-[18px] font-plusjakarta text-blue-700 ">
                  {instractor[3].name}
                </p>
                <p>{instractor[3].des}</p>
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
                      {courses[5].price}
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

export default office;
