import type { CourseAdmission } from "@/app/generated/prisma/client";

export type { CourseAdmission };

export const ADMISSION_ORDER = ["UPCOMING", "OPEN", "RUNNING", "COMPLETED"] as const;

/**
 * Shared presentation metadata for the course lifecycle, used by the public
 * cards/detail page, the admin table and the course form so the wording
 * never drifts between surfaces.
 */
export const ADMISSION_META: Record<
  CourseAdmission,
  {
    /** Bengali label shown to visitors. */
    label: string;
    /** English label for the admin panel. */
    adminLabel: string;
    /** Public pill classes. */
    pill: string;
    /** Admin table pill classes. */
    adminPill: string;
    /** Applications are accepted only in this stage. */
    accepting: boolean;
  }
> = {
  UPCOMING: {
    label: "ভর্তি শীঘ্রই",
    adminLabel: "Upcoming",
    pill: "bg-amber-500/95 text-white",
    adminPill: "bg-amber-50 text-amber-700",
    accepting: false,
  },
  OPEN: {
    label: "ভর্তি চলছে",
    adminLabel: "Admission open",
    pill: "bg-emerald-600/95 text-white",
    adminPill: "bg-emerald-50 text-emerald-700",
    accepting: true,
  },
  RUNNING: {
    label: "চলমান",
    adminLabel: "Running",
    pill: "bg-blue-600/95 text-white",
    adminPill: "bg-blue-50 text-blue-700",
    accepting: false,
  },
  COMPLETED: {
    label: "সমাপ্ত",
    adminLabel: "Completed",
    pill: "bg-slate-500/95 text-white",
    adminPill: "bg-slate-100 text-slate-500",
    accepting: false,
  },
};

export const isAdmissionOpen = (a: CourseAdmission) => ADMISSION_META[a].accepting;
