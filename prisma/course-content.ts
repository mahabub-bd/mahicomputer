/**
 * Per-course detail page content, migrated from the old hardcoded pages.
 * Used by the DB backfill script and by seed.ts so re-seeding keeps content.
 */
export interface CourseContent {
  description: string[];
  modules: string[];
  prerequisite: string;
  seats: string;
}

const seats10 = "10 students per batch.";

export const courseContent: Record<string, CourseContent> = {
  office: {
    description: [
      "Nowdays, computers are used in almost all fields due to the rise of information technology. Computer skills have become mandatory for almost everyone in education or the workplace, from superiors to subordinates. Typing skills in Bengali and English as well as knowledge of office software will boost your confidence tremendously.",
      "So, enroll in Mahi Computer Institute “Computer Office Application Course” today to enhance your skills and increase your efficiency. Take advantage of the free time you have especially after the SSC exam. “Computer Office Application Course” is a course of 3 months duration that includes detailed modules.",
    ],
    modules: [
      "COMPUTER FUNDAMENTAL",
      "MICROSOFT WORD",
      "MICROSOFT EXCEL AND ADVANCED EXCEL",
      "MICROSOFT POWERPOINT",
      "BANGLA & ENGLISH TYPING",
      "INTERNET & EMAIL",
    ],
    prerequisite: "Basic English Knowledge",
    seats: seats10,
  },

  advancedoffice: {
    description: [
      "Nowdays, computers are used in almost all fields due to the rise of information technology. Computer skills have become mandatory for almost everyone in education or the workplace, from superiors to subordinates. Typing skills in Bengali and English as well as knowledge of office software will boost your confidence tremendously.",
      "So, enroll in Mahi Computer Institute “Advanced Office Application Course” today to enhance your skills and increase your efficiency. Take advantage of the free time you have especially after the SSC exam. The Advanced Office Application course is a 6 months course that includes detailed modules.",
    ],
    modules: [
      "COMPUTER FUNDAMENTAL",
      "MICROSOFT WORD",
      "MICROSOFT EXCEL AND ADVANCED EXCEL",
      "MICROSOFT POWERPOINT",
      "BANGLA & ENGLISH TYPING",
      "INTERNET & EMAIL",
    ],
    prerequisite: "Basic English Knowledge",
    seats: seats10,
  },

  webdesign: {
    description: [
      "A Web Designer designs the entire navigation system of a website, text, files, images, audio, video where it will be. So to become a skilled web designer requires long term practice under quality organization.",
      "That why our web design course is designed to combine coding and creativity. Here every subject is taught by hand in class. Moreover, homework or practice work will familiarize you with the whole process. As a result, at the end of the course, you will be able to design a professional website yourself. And this certified web design course will serve as a reminder of your skills in your career.",
    ],
    modules: [
      "HTML5",
      "CSS3",
      "Bootstrap",
      "CSS3 Animation Effect",
      "Responsive Design",
      "Javascript",
    ],
    prerequisite: "Basic English Knowledge",
    seats: seats10,
  },

  advancedweb: {
    description: [
      "A Web Designer designs the entire navigation system of a website, text, files, images, audio, video where it will be. So to become a skilled web designer requires long term practice under quality organization.",
      "That why our web development course is designed to combine coding and creativity. Here every subject is taught by hand in class. Moreover, homework or practice work will familiarize you with the whole process. As a result, at the end of the course, you will be able to design a professional website yourself. And this certified course will serve as a reminder of your skills in your career.",
    ],
    modules: [
      "HTML5",
      "CSS3",
      "Bootstrap",
      "Tailwind CSS",
      "Javascript",
      "Figma",
      "React",
    ],
    prerequisite: "HTML & CSS basic knowledge",
    seats: seats10,
  },

  autocad: {
    description: [
      "AutoCAD is a leading software program used in various industries for computer-aided design (CAD) and drafting. It offers powerful tools for creating precise 2D and 3D models, making it a fundamental skill for architects, engineers, designers, and drafters. An AutoCAD 2D and 3D course modular provides a structured and comprehensive learning path to master the intricacies of this versatile software. In this course, we will explore the key modules of an AutoCAD course, highlighting the skills and knowledge gained at each stage.",
      "So, enroll in Mahi Computer Institute “AutoCAD Course” today to enhance your skills and increase your efficiency.",
    ],
    modules: [
      "Introduction to AutoCAD: The course begins with an introduction to AutoCAD, familiarizing participants with the software interface, navigation, and basic commands. They learn essential skills such as drawing lines, circles, arcs, and rectangles, using precision tools, and organizing drawings with layers. This module serves as the foundation for subsequent modules and helps participants build confidence in using AutoCAD.",
      "2D Drawing and Editing: The second module focuses on 2D drawing and editing techniques. Participants learn to create complex geometries using advanced commands like offset, trim, extend, fillet, and chamfer. They explore methods for drawing precise dimensions, adding text annotations, and creating reusable blocks. This module enhances participants ability to create accurate and detailed 2D drawings.",
      "2D Design and Documentation: In this module, participants dive into more advanced 2D design and documentation. They learn to use hatch patterns, gradients, and linetypes to enhance drawings. The module covers techniques for creating sections, elevations, and construction details. Participants also gain proficiency in dimensioning, creating and managing layouts, and generating plots and printouts. This module equips participants with the skills needed to produce professional-quality 2D designs and documentation.",
      "Introduction to 3D Modeling: The course then progresses to the 3D modeling module, where participants explore the world of 3D design. They learn to create solid and surface models using commands such as extrude, revolve, sweep, and loft. Participants understand the principles of creating complex 3D objects and manipulating them in 3D space. This module expands their design capabilities beyond 2D and introduces them to the realm of 3D visualization.",
    ],
    prerequisite: "Basic English Knowledge",
    seats: seats10,
  },

  sketchup: {
    description: [
      "SketchUp 3D is a powerful and user-friendly 3D modeling software that has revolutionized the world of design and visualization. Whether you are an architect, interior designer, engineer, or hobbyist, SketchUp provides an intuitive platform for creating and manipulating 3D models. In this course we will explore the features and benefits of SketchUp 3D and how it empowers users to bring their ideas to life.",
      "So, enroll in Mahi Computer Institute “SketchUp 3D Course” today to enhance your skills and increase your efficiency.",
    ],
    modules: [
      "Intuitive Interface and Ease of Use: One of the standout features of SketchUp 3D is its intuitive interface, which makes it accessible to both beginners and professionals. The software uses a simple approach that allows users to create and edit 3D models effortlessly. With its user-friendly tools and commands, navigating through the virtual space becomes a seamless experience, enabling users to focus on their creative process rather than getting bogged down by technical complexities.",
      "Versatility and Wide Range of Applications: SketchUp 3D caters to a diverse range of industries and applications. Architects can use it to create detailed building designs and visualize spaces in 3D, while interior designers can utilize it to plan room layouts, experiment with materials, and showcase their vision to clients. Engineers can employ SketchUp for creating prototypes and simulating real-world scenarios, while hobbyists and enthusiasts can explore their creativity by designing objects, landscapes, and even entire homes.",
      "Robust Modeling Tools and Features: SketchUp 3D provides a rich set of modeling tools that empower users to create intricate 3D models with ease. From basic geometric shapes to complex structures, SketchUp offers tools for drawing, extruding, pushing, pulling, and manipulating objects in 3D space. Users can accurately model architectural elements, furniture, vehicles, and other intricate details, thanks to features such as snapping, inference, and dimensioning tools.",
      "Dynamic Component System: One of the standout features of SketchUp 3D is its dynamic component system. This feature allows users to create intelligent and interactive models that respond to changes in parameters or properties. For example, a dynamic door component can be programmed to open and close with a click, or a dynamic furniture component can be adjusted in size and configuration. This flexibility enables users to create realistic and interactive visualizations, enhancing the overall design experience.",
    ],
    prerequisite: "Basic English Knowledge",
    seats: seats10,
  },

  graphics: {
    description: [
      "Graphics design is a modern, trending course in the job market. To make a concept come into reality companies need graphics design people to make visualization of their concept products. Graphics design jobs are also needed to make creative logos, designing brochures, flyers, newsletters; display banners ads, Website Mock-ups, etc. we hire creative and talented graphic designers as trainers for our courses. Our teaching method is helpful for even a complete beginner as our course cover from the very beginner level to the top advance level.",
      "We complete our course with a practical project in the end. After our class, a student can contact us for any further help & we also provide online help. so we are best for graphics design training in Dhaka Bangladesh. we use various tools for graphic design. students can learn very easy from our institute.",
    ],
    modules: [
      "Introduction to Graphic Design",
      "Typography and Layout",
      "Color Theory and Application",
      "Image Editing and Manipulation",
      "Logo Design",
      "Layout Design for Print",
      "Design for Social Media and Digital Marketing",
    ],
    prerequisite: "Basic English Knowledge",
    seats: seats10,
  },

  "3dmax": {
    description: [
      "Autodesk 3ds Max is the industry-standard software for 3D modeling, rendering, and animation — widely used in architectural visualization, interior design, gaming, and film production. Learning 3ds Max opens career opportunities as a 3D artist, visualizer, or interior renderer.",
      "In this course at Mahi Computer Training Center, students learn to model interior and exterior scenes step by step, apply realistic materials and lighting, and produce photorealistic renders with V-Ray/Corona. The course is fully practical — every class ends with hands-on project work.",
    ],
    modules: [
      "3ds Max Interface & Navigation: viewports, units, and essential tools.",
      "3D Modeling: standard primitives, editable poly modeling, and modifiers.",
      "Interior Modeling: walls, doors, windows, false ceilings, and furniture.",
      "Materials & Texturing: material editor, UV mapping, and realistic surfaces.",
      "Lighting: daylight systems, interior lights, and studio lighting setups.",
      "Rendering with V-Ray/Corona: camera setup, render settings, and post-production.",
      "Exterior & Final Project: complete architectural visualization from plan to final render.",
    ],
    prerequisite: "Basic computer knowledge",
    seats: seats10,
  },

  digitalmarketing: {
    description: [
      "Every business today needs a digital presence, and skilled digital marketers are among the most requested freelancers worldwide. This course teaches you how to grow brands online — from social media pages to paid ad campaigns — using professional tools and strategies.",
      "At Mahi Computer Training Center, students work on real business pages and campaigns: planning content, growing audiences, running Facebook and Google ads, and measuring results with analytics. The course is ideal for job seekers, business owners, and aspiring freelancers.",
    ],
    modules: [
      "Digital Marketing Fundamentals: strategy, funnels, and audience research.",
      "Social Media Marketing (Facebook, Instagram, YouTube): page setup, content planning, and organic growth.",
      "Facebook & Google Ads: campaign creation, targeting, budgeting, and boosting.",
      "Search Engine Optimization (SEO): keyword research, on-page SEO, and local SEO.",
      "Content & Email Marketing: writing posts that sell and building mailing lists.",
      "Analytics & Reporting: tracking results with Google Analytics and Ads Manager.",
      "Freelancing with Digital Marketing: marketplaces, client communication, and service packaging.",
    ],
    prerequisite: "Basic computer and internet knowledge",
    seats: seats10,
  },

  english: {
    description: [
      "English is the global language of education, business, and technology. Strong spoken and written English skills open doors to better jobs, higher education abroad, and confident communication in any workplace. Our Spoken English course is designed for students and professionals who want to speak fluently and naturally.",
      "At Mahi Computer Training Center, we focus on practical conversation — everyday speaking practice, group discussions, presentations, and interviews. Small batches ensure every student gets personal attention and daily speaking time with the instructor.",
    ],
    modules: [
      "Basic to Advanced Grammar: tenses, sentence structure, and common error correction.",
      "Vocabulary Building: everyday words, office and academic vocabulary, word usage practice.",
      "Speaking Practice: daily conversation, group discussion, and presentation sessions.",
      "Listening Skills: understanding movies, news, and native-speed conversation.",
      "Reading & Writing: email writing, applications, essays, and comprehension.",
      "Interview & CV Preparation: mock interviews and professional self-introduction.",
    ],
    prerequisite: "SSC pass / basic English knowledge",
    seats: seats10,
  },

  japani: {
    description: [
      "Japan is one of the top destinations for Bangladeshi students and workers, and the Japanese language is the key that unlocks that opportunity. Our Japanese Language course prepares students for JLPT N5/N4 level proficiency, covering reading, writing, listening, and everyday conversation.",
      "At Mahi Computer Training Center, the course starts from the very basics — Hiragana and Katakana — and gradually builds toward kanji, grammar patterns, and natural conversation. Students also receive guidance about the Japanese student visa process and work culture in Japan.",
    ],
    modules: [
      "Hiragana & Katakana: the two Japanese scripts, reading and writing practice.",
      "Basic Kanji: the most essential characters for JLPT N5 level.",
      "Grammar Foundations: particles, verb groups, and sentence patterns.",
      "Listening & Conversation: greetings, self-introduction, shopping, and daily situations.",
      "JLPT N5 Preparation: model questions, mock exams, and time management.",
      "Japanese Culture & Work Etiquette: what to expect when you arrive in Japan.",
    ],
    prerequisite: "SSC pass / no prior Japanese knowledge needed",
    seats: seats10,
  },

  videoediting: {
    description: [
      "Video content dominates social media, marketing, and entertainment today — and skilled video editors are in high demand everywhere, from YouTube channels to production houses. This course teaches professional video editing from the ground up using industry-standard software.",
      "At Mahi Computer Training Center, students practice with real footage from day one: cutting, transitions, color correction, audio cleanup, titles, and effects. By the end of the course, every student completes a showreel project they can use to get freelance work or a studio job.",
    ],
    modules: [
      "Editing Fundamentals: timeline, cutting, trimming, and sequencing.",
      "Transitions & Effects: creative transitions, speed effects, and motion graphics basics.",
      "Color Correction & Grading: making footage look cinematic and consistent.",
      "Audio Editing: voice cleanup, background music, and sound effects.",
      "Titles & Subtitles: professional text animation and lower-thirds.",
      "YouTube & Social Media Formats: export settings for every platform.",
      "Final Showreel Project: edit a complete video portfolio piece.",
    ],
    prerequisite: "Basic computer knowledge",
    seats: seats10,
  },

  hardware: {
    description: [
      "Computer hardware and networking skills are always in demand — every office, school, and service center needs technicians who can assemble, troubleshoot, and maintain computers. This course takes you inside the machine: every component, every connection, and every common fault.",
      "At Mahi Computer Training Center, the training is fully hands-on. Students assemble and disassemble real PCs, install operating systems and drivers, diagnose hardware faults, and set up small office networks with confident, professional practice.",
    ],
    modules: [
      "PC Components: motherboard, processor, RAM, storage, PSU, and casing — how each works.",
      "PC Assembly & Disassembly: complete hands-on building of a computer.",
      "BIOS/UEFI & OS Installation: Windows installation, drivers, and partitioning.",
      "Troubleshooting & Repair: diagnosing common hardware faults and failures.",
      "Laptop Basics: laptop parts, upgrade, and basic maintenance.",
      "Networking Fundamentals: LAN setup, crimping, routers, and internet sharing.",
      "Printer & Peripheral Setup: installation and basic servicing.",
    ],
    prerequisite: "SSC pass / basic computer knowledge",
    seats: seats10,
  },

  ict: {
    description: [
      "ICT is a compulsory subject for SSC and HSC students — and it is also one of the highest-scoring. Our ICT course follows the NCTB syllabus exactly, chapter by chapter, so students are fully prepared for both the written exam and the practical test.",
      "At Mahi Computer Training Center, experienced instructors explain every topic in simple Bangla and English, solve board exam questions from previous years, and guide students through the practical lab work required for the exam.",
    ],
    modules: [
      "Global Village & ICT Basics: complete first-chapter coverage with board questions.",
      "Communication Systems & Networking: data transmission, network types, and devices.",
      "Number Systems & Digital Logic: conversion practice and logic gate problems.",
      "Web Design & HTML: syllabus HTML topics with practical lab work.",
      "Programming Logic: C programming chapters explained from the textbook.",
      "Database Management: database concepts and Access/MySQL practicals.",
      "Board Question Solving: previous years' written and practical exam preparation.",
    ],
    prerequisite: "Currently studying in SSC or HSC",
    seats: seats10,
  },

  freelancing: {
    description: [
      "Freelancing lets you earn in dollars from home — but success requires more than just skills: you need a professional profile, winning gig strategies, and confident client communication. This course guides you step by step from account creation to your first completed order.",
      "At Mahi Computer Training Center, we help each student identify their strongest service skill, build a standout Fiverr and Upwork profile, write winning proposals, and manage payments through Payoneer and bank transfer — with real account reviews in class.",
    ],
    modules: [
      "Freelancing Mindset & Skill Selection: choosing a service the market actually buys.",
      "Fiverr: account setup, SEO-friendly gig creation, pricing, and images.",
      "Upwork: professional profile, proposal writing, and Connect strategy.",
      "Client Communication: understanding requirements, revisions, and 5-star service.",
      "Payment Methods: Payoneer, bank withdrawal, and tax basics in Bangladesh.",
      "Portfolio Building: collecting and presenting your best work.",
      "Scaling Up: getting repeat clients, raising rates, and agency path.",
    ],
    prerequisite: "Basic computer and English knowledge",
    seats: seats10,
  },
};
