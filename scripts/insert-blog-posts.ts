import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env", quiet: true });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const posts = [
  {
    slug: "backend-development-with-nestjs-and-typeorm",
    title: "Backend Development with NestJS and TypeORM",
    excerpt:
      "Learn how to build scalable, production-ready server-side applications using NestJS and TypeORM — from project structure and modules to database relations and migrations.",
    content: `Backend development is the backbone of any modern web application, and NestJS has quickly become one of the most popular frameworks for building it. NestJS is a progressive Node.js framework built with TypeScript that uses a modular, decorator-based architecture inspired by Angular. Its structured approach — modules, controllers, providers, and dependency injection — keeps large codebases clean, testable, and easy to scale.

TypeORM is the natural companion to NestJS for database work. As an Object-Relational Mapper written in TypeScript, it lets you define your database schema using entities and decorators, then query it with a fluent repository API instead of raw SQL. Relations such as one-to-many and many-to-many are declared directly on the entity classes, so the database model and application code always stay in sync.

Together, NestJS and TypeORM give you a complete backend toolkit: REST APIs with built-in validation pipes and guards, database migrations for safe schema evolution, and first-class support for PostgreSQL, MySQL, and more. Authentication with JWT, role-based access control, and DTO-based validation all follow well-established patterns that are documented and battle-tested.

In our Backend Development course, students build a real-world project step by step — setting up a NestJS project, designing entities and relations with TypeORM, implementing CRUD endpoints, securing routes with authentication, and finally deploying the API to production. By the end, you will be able to design and ship a complete, professional backend on your own.`,
  },
  {
    slug: "frontend-development-with-react-and-nextjs",
    title: "Frontend Development with React & Next.js",
    excerpt:
      "Discover how React and Next.js work together to create fast, SEO-friendly, modern web interfaces — components, hooks, routing, server-side rendering, and more.",
    content: `Frontend development is all about what users see and interact with, and React is the world's most widely used library for building those interfaces. React breaks a page into reusable components, manages state with hooks like useState and useEffect, and updates the UI efficiently through its virtual DOM. Learning React means learning to think in components — small, composable pieces that make complex UIs manageable.

Next.js builds on top of React and solves its remaining challenges: routing, data fetching, and performance. With file-based routing, every file in the app directory automatically becomes a page. Server-Side Rendering (SSR) and Static Site Generation (SSG) deliver pages that load fast and rank well in search engines, while Server Components and API routes let you handle backend logic right inside the same project.

The React + Next.js combination is the industry standard for modern web development. It powers everything from marketing sites and blogs to full-scale dashboards and e-commerce platforms, and it is one of the most in-demand skill sets in the job market today.

In our Frontend Development course, you will start with the fundamentals of React — components, props, hooks, and styling — and progress to building complete Next.js applications with dynamic routes, image optimization, API integration, and deployment on Vercel. By the end of the course, you will have a portfolio of real projects and the confidence to work as a professional frontend developer.`,
  },
];

async function main() {
  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        published: true,
      },
      create: { ...post, published: true },
    });
    console.log("Upserted:", post.slug);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
