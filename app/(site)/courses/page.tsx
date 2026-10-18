import React from "react";
import { Courses } from "@/app/components";
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
    </div>
  );
};

export default CoursesPage;
