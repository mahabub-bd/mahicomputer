/**
 * Vercel Blob URLs recovered from the image store after the 2026-10-27
 * database wipe. Mapping was done by visually identifying every blob.
 * Store: ljspkxuyyipd39xe.public.blob.vercel-storage.com
 */

const B = "https://ljspkxuyyipd39xe.public.blob.vercel-storage.com";

/** Course slug → cover image blob URL. */
export const courseImages: Record<string, string> = {
  webdesign: `${B}/1792415465953-567cc71b302e.jpg`, // Responsive Web Design
  advancedweb: `${B}/1792415494445-a384e0b5adbf.jpg`, // Web Development
  autocad: `${B}/1792415527785-c3ce1f1c0624.webp`, // AutoCAD
  sketchup: `${B}/1792415564531-9f95039f85b2.webp`, // SketchUp
  "3dmax": `${B}/1792415594034-c7bf1acc039c.webp`, // 3DS Max
  office: `${B}/1792415614341-4b83778e44df.webp`, // MS Office
  advancedoffice: `${B}/1792416676208-808ed7759a62.webp`, // MS Office (2nd upload)
  graphics: `${B}/1792416691200-23dd10d4c095.webp`, // Graphic Design (dark)
  english: `${B}/1792416712883-51ce70b293c4.webp`, // Spoken English
  japani: `${B}/1792417461954-ac5aba940036.png`, // Japani Language
  videoediting: `${B}/1792417484276-c7a6a311b915.jpg`, // Video Editing
  hardware: `${B}/1792417508027-74cb4b83ea96.png`, // Computer Hardware
  ict: `${B}/1792417527891-3541c7cc096b.png`, // HSC/SSC ICT
  digitalmarketing: `${B}/1792417545476-5ca34044ae86.jpg`, // Digital Marketing
  freelancing: `${B}/1792417562639-4de3e1105e71.png`, // Freelancing
};

/** Category title (as in seed-data/categories.ts) → icon blob URL. */
export const categoryImages: Record<string, string> = {
  "Web Development": `${B}/1792417593957-56019c59795d.png`, // monitor + code
  "App Development": `${B}/1792417611027-9b4e38df6998.png`, // phone + code
  "UI/UX Design": `${B}/1792417630190-f66f58661365.png`, // UX window + pencil
  "Graphics Design": `${B}/1792417643260-8a501907b647.png`, // monitor + paint brush
  "Auto CAD 2D/3D": `${B}/1792417660937-dee2dd58ff6c.png`, // 3D cube + blueprint
  "Computer Hardware ": `${B}/1792417674485-ecae52a8623e.png`, // PC parts
  "Digital Marketing": `${B}/1792417684477-24148e890b3e.png`, // social media marketing
  "Office Application": `${B}/1792417705647-f000ced1adc6.png`, // Office docs
  "Language Course": `${B}/1792417714504-4b598aec412f.png`, // person + speech bubbles
  "ICT HSC & SSC": `${B}/1792417723199-7f763d34fbc3.png`, // graduation cap + book
  "Video Editing": `${B}/1792417740201-afcbfd50e208.png`, // video timeline
  Freelancing: `${B}/1792417751570-298ab50c1c5c.png`, // person + laptop + globe
  "3D Animation (3ds Max)": `${B}/1792417762587-bc08fdc4cdb0.png`, // 3D character modeling
  "Sketch Up 3D Design": `${B}/1792417775158-d2d0012f0418.png`, // house architecture
  "Spoken English": `${B}/1792417786712-da162be31b18.png`, // UK flag bubble
  "Japanese Language": `${B}/1792417795952-4259aeb2573b.png`, // Japan flag bubble
  Networking: `${B}/1792417804527-0fc1cd987990.png`, // network
  SEO: `${B}/1792417816536-181e4be6eda8.png`, // chart + magnifier + gear
};

/**
 * Instructor images, in the seed array order
 * (instractor1, 2, 6, 3, 4, 5, 7, 8, 9, 10).
 */
export const instructorImages: string[] = [
  `${B}/1792417838211-0e89b2a209eb.jpg`, // 1 — Muniruzzaman
  `${B}/1792417849279-77c945a852a5.jpg`, // 2 — Mokramin Hossain
  `${B}/1792417860731-f815cb68564d.jpg`, // 6
  `${B}/1792417872602-b749b3aff35b.jpg`, // 3 — Mahabub Hossain
  `${B}/1792417893189-ab8648d3c278.jpg`, // 4 — Md Alamin Hossain
  `${B}/1792417910288-5dc8fb5e971e.jpg`, // 5 — Sumon Chandra
  `${B}/1792417922334-ea0987e763b2.jpg`, // 7 — Md. Rasel Ahmed
  `${B}/1792417937158-a238dd20f5e9.jpg`, // 8
  `${B}/1792417957173-d3c20a9da7a7.jpg`, // 9
  `${B}/1792417974711-ba90803dbb59.jpg`, // 10
];

/** Partner alt → logo blob URL. */
export const partnerImages: Record<string, string> = {
  bteb: `${B}/1792432169769-258f7dc4a50a.webp`, // BTEB logo
  gov: `${B}/1792432181847-5428903d2689.webp`, // Govt. of Bangladesh
  dmpi: `${B}/1792432230410-edcae3bb5d86.webp`, // Dhaka Mohila Polytechnic
};

/** Gallery / about institute photos. */
export const galleryImages: string[] = [
  `${B}/1792418021232-9e72c978be18.webp`, // group photo 2022
  `${B}/1792418062461-e6349ac7c1ba.webp`, // large group photo 2023
  `${B}/1792418072982-108108448e90.webp`, // presenting @ Mahi Computer's
  `${B}/1792424092460-80f3b12d503d.webp`, // reception
  `${B}/1792424128510-bef3a55d8b53.webp`, // certificate ceremony
  `${B}/1792424140561-88cacf02d2b6.webp`, // 30+ training centres meeting
  `${B}/1792424159239-6077c00c8871.webp`, // certificate handover
  `${B}/1792424187333-1939d7ae1a74.webp`, // women's batch
  `${B}/1792424267676-8bcdba06d020.webp`, // computer lab
  `${B}/1792424288948-a69ee2f8a34b.webp`, // certificate ceremony 2
  `${B}/1792424304420-273f3818090b.webp`, // classroom study circle
  `${B}/1792424341295-e62e14d65281.webp`, // teachers' training
  `${B}/1792424369865-1ebf220db496.webp`, // 3D house render
  `${B}/1792424385758-5a4e7bef0d05.webp`, // evening class
  `${B}/1792424400659-44a892166bfe.webp`, // government notice board
  `${B}/1792424424457-33812299e58a.webp`, // online class
  `${B}/1792424438753-8af0dcff8a46.webp`, // students at computers
  `${B}/1792424459265-03ee6209d70c.webp`, // practical training
  `${B}/1792424478697-ca313657e02c.webp`, // seminar
  `${B}/1792424546584-ab361d5bd011.webp`, // online session
  `${B}/1792424565949-32379fe7582d.webp`, // lab with banner
  `${B}/1792424577689-f8524fd6d6d4.webp`, // students
  `${B}/1792424595445-02cae56e5d24.webp`, // staff with students
  `${B}/1792859588213-6e2a0b86b2bf.webp`, // BTEB meeting 1
  `${B}/1792861553795-eb4aec05cac2.webp`, // meeting room
  `${B}/1792930546152-af25a17d5d0b.webp`, // BTEB meeting wide
  `${B}/1792937160940-c32765afa6e1.webp`, // NSDA approval graphic
];

/** Blog slug → cover blob URL (lib/data blog images). */
export const blogImages: Record<string, string> = {
  devops: `${B}/1792415186695-70e6d7c1e33e.webp`, // DevOps career
  "graphic-design-career-guide": `${B}/1792415235215-1fb1be8ea16b.webp`,
  "react-shikhun-sahaj-upay": `${B}/1792415247889-1889802e190d.webp`,
  "postgresql-database-shikhun": `${B}/1792421861767-48b89f6a4ec0.webp`,
  "frontend-development-with-react-and-nextjs": `${B}/1792861553795-eb4aec05cac2.webp`,
  "backend-development-with-nestjs-and-typeorm": `${B}/1792861563753-b36b33fd351d.webp`,
  "digital-marketing-career-bangladesh": `${B}/1792498426541-a401bb99ce2c.webp`,
  "computer-shikher-shuruprothom-din": `${B}/1792675199558-4c545473d230.webp`,
  "office-application-keno-shikhben": `${B}/1792675439749-11c275e9f590.webp`,
};

/** Site settings images. */
export const siteImages = {
  ceo: `${B}/1792930129703-9700f4c5f9da.jpg`, // formal headshot (blue shirt)
};

/**
 * Review photos, in seed-data/review.ts array order.
 * Undefined = keep the original /images path (file may not exist).
 */
export const reviewImages: (string | undefined)[] = [
  `${B}/1792455583855-d40f14e8b020.jpg`, // jarin-subah (girl, braids)
  `${B}/1792455622131-ec5f1ecf556e.jpg`, // md-mamum-or-rashid (black suit)
  `${B}/1792455663545-1d8f3d5fd261.jpg`, // monira (woman, dark hair)
  `${B}/1792455605587-fe6b98a10d51.png`, // tarak-mahmud (cadet uniform)
  `${B}/1792942150813-ddc4ce868bcc.webp`, // faysal-opu (navy shirt)
  `${B}/1792455642271-d7ad5fc83827.jpg`, // ranver-arafat (navy suit)
  `${B}/1792990446583-f8c6f828f5d0.jpg`, // nova-khatun (red hijab)
];
