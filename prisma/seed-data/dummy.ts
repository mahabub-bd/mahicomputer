/**
 * Dummy data for the admission / batch / content modules.
 * All names are invented — none of these are real students or real payments.
 * `course` values must match titles from ./courses so admin lookups work.
 */

export const dummySubscribers = [
  "rahim.uddin@example.com",
  "fatema.akter@example.com",
  "kamrul.dev@example.com",
  "nusrat.jahan@example.com",
  "tanvir.ahmed@example.com",
];

export const dummyMessages = [
  {
    name: "Sabbir Hossain",
    email: "sabbir.hossain@example.com",
    phone: "+8801711000111",
    message:
      "আমি ওয়েব ডেভেলপমেন্ট কোর্সে ভর্তি হতে চাই। কোর্স ফি ও ক্লাসের সময়সূচি জানতে চাই।",
    read: false,
  },
  {
    name: "Mitu Rahman",
    email: "mitu.rahman@example.com",
    phone: "+8801811000222",
    message: "গ্রাফিক্স ডিজাইন কোর্সের পরবর্তী ব্যাচ কখন শুরু হবে?",
    read: false,
  },
  {
    name: "Hasan Mahmud",
    email: "hasan.mahmud@example.com",
    phone: "+8801911000333",
    message: "Video editing course er installment option ache ki?",
    read: true,
  },
];

export const dummyNotices = [
  {
    title: "রমজান মাসে ক্লাসের সময়সূচি পরিবর্তন",
    body: "রমজান মাসে সকল কোর্সের ক্লাস বিকাল ৪টা থেকে শুরু হবে। সবাই নোটিশটি অনুসরণ করুন।",
    published: true,
  },
  {
    title: "নতুন ব্যাচ ভর্তি চলছে — রেসপনসিভ ওয়েব ডিজাইন",
    body: "আগামী মাসের ৫ তারিখ থেকে নতুন ব্যাচ শুরু হচ্ছে। সীমিত আসন, আগে এলে আগে পাবেন ভিত্তিতে ভর্তি চলছে।",
    published: true,
  },
  {
    title: "সার্টিফিকেট বিতরণ অনুষ্ঠান",
    body: "সম্পন্নকৃত কোর্সের শিক্ষার্থীদের সার্টিফিকেট বিতরণ আগামী শুক্রবার সকাল ১১টায় ইনস্টিটিউট মিলনায়তনে অনুষ্ঠিত হবে।",
    published: false,
  },
];

export const dummyNewsletters = [
  {
    title: "অক্টোবর ২০২৬ — নতুন কোর্স ও অফার",
    body: "এই মাসে ভিডিও এডিটিং ও অ্যাডভান্সড গ্রাফিক্স ডিজাইন কোর্সে ১০% ছাড় চলছে। আবেদন করতে ভর্তি ফরম পূরণ করুন।",
    published: true,
  },
  {
    title: "সেপ্টেম্বর ২০২৬ — ব্যাচ রুটিন",
    body: "সকল চলমান ব্যাচের নতুন রুটিন প্রকাশিত হয়েছে। বিস্তারিত নোটিশ পেজে দেখুন।",
    published: true,
  },
];

export const dummyPosts = [
  {
    slug: "web-development-career-guide",
    title: "ওয়েব ডেভেলপার হতে কত দিন লাগে? — একটি বাস্তব গাইড",
    excerpt:
      "শূন্য থেকে জব-রেডি ওয়েব ডেভেলপার হতে কী কী শিখতে হয় এবং কত সময় লাগে, তার ধাপে ধাপে ব্যাখ্যা।",
    content:
      "ওয়েব ডেভেলপমেন্ট শেখা শুরু করার আগে সবচেয়ে গুরুত্বপূর্ণ প্রশ্ন হলো — কত দিন লাগবে?\n\nপ্রথম ১-২ মাসে HTML, CSS ও বেসিক JavaScript শিখুন। এরপর ২-৩ মাসে React বা Next.js এর মতো ফ্রেমওয়ার্ক এবং ডেটাবেসের বেসিক বিষয়গুলো আয়ত্তে আনুন।\n\nসবচেয়ে জরুরি হলো প্র্যাকটিস — প্রতিটি শেখা বিষয় দিয়ে ছোট ছোট প্রজেক্ট বানান। ৬ মাসের নিয়মিত চর্চায় আপনি ফ্রিল্যান্সিং বা জুনিয়র পজিশনের জন্য প্রস্তুত হতে পারবেন।",
    published: true,
  },
  {
    slug: "freelancing-marketplace-tips",
    title: "ফ্রিল্যান্সিং মার্কেটপ্লেসে প্রথম অর্ডার পাওয়ার উপায়",
    excerpt:
      "Upwork, Fiverr-এ প্রোফাইল সাজিয়ে প্রথম অর্ডার আনার ৭টি কার্যকর টিপস।",
    content:
      "নতুন ফ্রিল্যান্সারদের সবচেয়ে বড় চ্যালেঞ্জ প্রথম অর্ডার।\n\n১. প্রোফাইল সম্পূর্ণ করুন — প্রফেশনাল ছবি, স্কিল ট্যাগ ও পোর্টফোলিও লিংক দিন।\n২. নির্দিষ্ট একটি নিশে (niche) ফোকাস করুন।\n৩. ছোট প্রজেক্ট দিয়ে শুরু করে রিভিউ সংগ্রহ করুন।\n৪. প্রতিটি প্রপোজাল ক্লায়েন্টের রিকোয়ারমেন্ট অনুযায়ী লিখুন।",
    published: true,
  },
  {
    slug: "graphic-design-tools-2026",
    title: "২০২৬ সালে গ্রাফিক ডিজাইনারদের জন্য সেরা টুলস",
    excerpt: "Illustrator থেকে Figma — কোন কাজে কোন টুল ব্যবহার করবেন।",
    content:
      "গ্রাফিক ডিজাইন শেখার সময় সঠিক টুল নির্বাচন গুরুত্বপূর্ণ।\n\nলোগো ও ব্র্যান্ডিংয়ের জন্য Adobe Illustrator, ফটো এডিটিংয়ের জন্য Photoshop, UI/UX ডিজাইনের জন্য Figma এবং প্রিন্ট ডিজাইনের জন্য InDesign সবচেয়ে প্রচলিত।",
    published: true,
  },
];

export interface DummyEnrollment {
  name: string;
  phone: string;
  email: string;
  course: string;
  message: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
  /** Human-readable student ID — required for APPROVED. */
  studentId?: string;
  /** YYYY-MM-DD the admission was submitted (defaults to 2026-10-05). */
  appliedAt?: string;
  courseFee?: number;
  installmentPlan?: number[];
  discount?: number;
  /** Total collected; dummy Payment rows are generated to match. */
  paidAmount?: number;
  paymentMethod?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  fatherName?: string;
  motherName?: string;
  education?: string;
  address?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export const dummyEnrollments: DummyEnrollment[] = [
  {
    name: "Rahim Uddin",
    phone: "+8801711223344",
    email: "rahim.uddin@example.com",
    course: "Responsive Web Design",
    message: "এভনিং ব্যাচে ভর্তি হতে চাই।",
    status: "APPROVED",
    studentId: "MC-2026-0001",
    appliedAt: "2026-09-01",
    courseFee: 12000,
    installmentPlan: [4000, 4000, 4000],
    paidAmount: 8000,
    paymentMethod: "bKash",
    gender: "MALE",
    fatherName: "Karim Uddin",
    motherName: "Salma Begum",
    education: "HSC",
    address: "Sector 7, Uttara, Dhaka",
    guardianName: "Karim Uddin",
    guardianPhone: "+8801711223300",
  },
  {
    name: "Fatema Akter",
    phone: "+8801811223344",
    email: "fatema.akter@example.com",
    course: "Advanced Graphics Design",
    message: "",
    status: "APPROVED",
    studentId: "MC-2026-0002",
    appliedAt: "2026-09-03",
    courseFee: 10000,
    installmentPlan: [5000, 5000],
    paidAmount: 10000,
    paymentMethod: "Nagad",
    gender: "FEMALE",
    fatherName: "Abdul Malek",
    motherName: "Rahima Khatun",
    education: "Honours 2nd year",
    address: "Badda, Dhaka",
    guardianName: "Abdul Malek",
    guardianPhone: "+8801811223300",
  },
  {
    name: "Jamal Hossain",
    phone: "+8801911223344",
    email: "jamal.hossain@example.com",
    course: "Video Editing",
    message: "ফ্রিল্যান্সিংয়ের জন্য ভিডিও এডিটিং শিখতে চাই।",
    status: "APPROVED",
    studentId: "MC-2026-0003",
    appliedAt: "2026-09-10",
    courseFee: 15000,
    installmentPlan: [7500, 7500],
    paidAmount: 7500,
    paymentMethod: "Cash",
    gender: "MALE",
    fatherName: "Mizanur Rahman",
    motherName: "Nasrin Sultana",
    education: "SSC",
    address: "Vatara, Dhaka",
    guardianName: "Mizanur Rahman",
    guardianPhone: "+8801911223300",
  },
  {
    name: "Nusrat Jahan",
    phone: "+8801611223344",
    email: "nusrat.jahan@example.com",
    course: "Computer Office Application",
    message: "",
    status: "APPROVED",
    studentId: "MC-2026-0004",
    appliedAt: "2026-06-02",
    courseFee: 6000,
    installmentPlan: [3000, 3000],
    discount: 500,
    paidAmount: 5500,
    paymentMethod: "Cash",
    gender: "FEMALE",
    fatherName: "Jashim Uddin",
    motherName: "Ayesha Siddika",
    education: "HSC",
    address: "Khilgaon, Dhaka",
    guardianName: "Jashim Uddin",
    guardianPhone: "+8801611223300",
  },
  {
    name: "Tanvir Ahmed",
    phone: "+8801511223344",
    email: "tanvir.ahmed@example.com",
    course: "Responsive Web Design",
    message: "চাকরির পাশাপাশি শিখতে চাই, ক্লাস কি সন্ধ্যায় হয়?",
    status: "APPROVED",
    studentId: "MC-2026-0005",
    appliedAt: "2026-09-12",
    courseFee: 12000,
    installmentPlan: [4000, 4000, 4000],
    paidAmount: 4000,
    paymentMethod: "bKash",
    gender: "MALE",
    fatherName: "Anwar Hossain",
    motherName: "Rokeya Begum",
    education: "Diploma",
    address: "Mirpur, Dhaka",
    guardianName: "Anwar Hossain",
    guardianPhone: "+8801511223300",
  },
  {
    name: "Kamrul Islam",
    phone: "+8801711445566",
    email: "kamrul.islam@example.com",
    course: "Responsive Web Design",
    message: "ওয়েব ডেভেলপমেন্ট শিখতে আগ্রহী।",
    status: "PENDING",
    appliedAt: "2026-10-20",
  },
  {
    name: "Shapla Khatun",
    phone: "+8801811445566",
    email: "shapla.khatun@example.com",
    course: "Advanced Graphics Design",
    message: "মেয়েদের আলাদা ব্যাচ আছে কি?",
    status: "PENDING",
    appliedAt: "2026-10-24",
  },
  {
    name: "Arif Chowdhury",
    phone: "+8801911445566",
    email: "arif.chowdhury@example.com",
    course: "Video Editing",
    message: "ফি অনেক বেশি মনে হচ্ছে।",
    status: "DECLINED",
    appliedAt: "2026-10-18",
  },
];

export const dummyBatches = [
  {
    course: "Responsive Web Design",
    name: "RWD Batch 1 — Evening",
    startDate: "2026-09-15",
    schedule: "Sat, Mon, Wed — 6:00 PM",
    capacity: 12,
    status: "RUNNING" as const,
    note: "Current running evening batch.",
    /** Dummy enrollment indexes (0-based) in this batch. */
    students: [0, 4],
    sessions: [
      { date: "2026-10-06", topic: "HTML structure & semantic tags" },
      { date: "2026-10-10", topic: "CSS flexbox layouts" },
      { date: "2026-10-13", topic: "CSS grid practice" },
      { date: "2026-10-17", topic: "Media queries & responsive images" },
      { date: "2026-10-24", topic: "Portfolio project kickoff" },
    ],
    /** Attendance for the sessions above, per student: P=present, L=late, A=absent. */
    attendance: [
      ["P", "P", "L", "P", "P"],
      ["P", "P", "P", "A", "P"],
    ],
  },
  {
    course: "Advanced Graphics Design",
    name: "Graphics Batch 1 — Morning",
    startDate: "2026-11-05",
    schedule: "Sat, Tue — 10:00 AM",
    capacity: 10,
    status: "UPCOMING" as const,
    note: "Starts next month; seats still open.",
    students: [1],
    sessions: [],
    attendance: [],
  },
  {
    course: "Computer Office Application",
    name: "Office Batch 3 — Day",
    startDate: "2026-06-01",
    schedule: "Sun, Tue, Thu — 11:00 AM",
    capacity: 0,
    status: "COMPLETED" as const,
    note: "",
    students: [3],
    sessions: [
      { date: "2026-06-04", topic: "Word: documents & formatting" },
      { date: "2026-06-18", topic: "Excel: formulas & charts" },
      { date: "2026-07-02", topic: "PowerPoint presentations" },
      { date: "2026-08-20", topic: "Final assessment" },
    ],
    attendance: [
      ["P", "P", "P", "P"],
      ["L", "P", "P", "P"],
      ["P", "A", "P", "P"],
      ["P", "P", "A", "P"],
    ],
  },
];

/** Payment rows generated from paidAmount, in installmentPlan-sized chunks. */
export const paymentChunks = (e: DummyEnrollment): number[] => {
  const plan = e.installmentPlan ?? [];
  const paid = e.paidAmount ?? 0;
  const chunks: number[] = [];
  let left = paid;
  for (const amount of plan) {
    if (left <= 0) break;
    chunks.push(Math.min(amount, left));
    left -= Math.min(amount, left);
  }
  if (left > 0) chunks.push(left);
  return chunks;
};
