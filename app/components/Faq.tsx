"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Faq } from "@/lib/types";

interface FaqProps {
  /** Admin-managed FAQs from the DB. */
  faqs: Faq[];
}

const Faq = ({ faqs }: FaqProps) => {
  if (faqs.length === 0) return null;

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="section-title text-center font-bangla" data-aos="fade-up">
          সাধারণ জিজ্ঞাসা
        </h2>
        <p
          className="mx-auto mt-3 max-w-xl text-center font-bangla text-[15px] leading-7 text-slate-500"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          আপনার প্রশ্নের উত্তর এখানে না পেলে কল করুন — আমরা সবসময় পাশে আছি
        </p>

        <div className="mt-8 space-y-3">
          {faqs.map(({ id, question, answer }, i) => (
            <FaqItem key={id} question={question} answer={answer} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FaqItem = ({
  question,
  answer,
  defaultOpen,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = () => setOpen((o) => !o);

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
        open ? "border-blue-200" : "border-slate-100"
      }`}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={toggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-bangla text-[15px] font-bold text-slate-900">
          {question}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-blue-600 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="whitespace-pre-line px-5 pb-4 font-bangla text-[14px] leading-7 text-slate-600">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Faq;
