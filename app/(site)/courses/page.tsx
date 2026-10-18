import React from "react";
import { Courses } from "@/app/components";
<<<<<<< HEAD
import { getPublicCourseViews } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Courses",
  description:
    "Browse the full course catalog of Mahi Computer Training Center — office applications, graphic design, web development, CAD, hardware, freelancing and more.",
  alternates: { canonical: "/courses" },
  openGraph: { url: "/courses", title: `All Courses | ${SITE_NAME}` },
};

const CoursesPage = async () => {
  // Same published-course view model the navbar mega menu uses.
  const courses = await getPublicCourseViews();

  return (
    <div>
      <Courses courses={courses} variant="page" />
=======
import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Courses",
  description:
    "Browse the full course catalog of Mahi Computer Training Center — office applications, graphic design, web development, CAD, hardware, freelancing and more.",
  alternates: { canonical: "/courses" },
  openGraph: { url: "/courses", title: `All Courses | ${SITE_NAME}` },
};

const CoursesPage = () => {
  return (
    <div>
      <Courses />
>>>>>>> 8b57dd81f4b6274869ff3d96c8916c651ef76d20
    </div>
  );
};

export default CoursesPage;
