"use client";

import type { GalleryView } from "@/lib/types";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import styles from "../styles/style";

const GRID_SIZES =
  "(min-width: 1800px) 500px, (min-width: 1700px) 440px, (min-width: 768px) 45vw, 92vw";

const Gallery = ({ items = [] }: { items?: GalleryView[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setActiveIndex(null), []);

  const showPrevious = useCallback(
    () =>
      setActiveIndex((index) =>
        index === null ? index : (index - 1 + items.length) % items.length
      ),
    [items.length]
  );

  const showNext = useCallback(
    () =>
      setActiveIndex((index) =>
        index === null ? index : (index + 1) % items.length
      ),
    [items.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, closeLightbox, showPrevious, showNext]);

  return (
    <section
      id="gallery"
      className="mx-auto max-w-350 2xl:max-w-[1536px] scroll-mt-24 px-4 sm:px-6"
    >
      <h2
        className={`${styles.heading2} text-center my-4 font-bangla`}
        data-aos="fade-up"
      >
        ইমেজ গ্যালারী
      </h2>
      <p
        className="mx-auto -mt-1 mb-4 max-w-2xl text-center font-bangla text-[16px] leading-7 text-slate-500"
        data-aos="fade-up"
      >
        ক্লাসরুম, ল্যাব, ইভেন্ট ও ছাত্রছাত্রীদের স্মরণীয় মুহূর্ত একনজরে
      </p>

      <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {items.map((item, index) => (
          <button
            key={item.alt}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`ছবি ${index + 1} সম্পূর্ণ পর্দায় দেখুন`}
            data-aos="fade-up"
            data-aos-delay={Math.min(index, 6) * 60}
            className="group relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-xl bg-slate-100 shadow-md shadow-slate-200/60 ring-1 ring-slate-200/80 transition duration-300 hover:shadow-xl hover:ring-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Image
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              src={item.img}
              alt={item.alt}
              fill
              priority={index === 0}
              sizes={GRID_SIZES}
            />

            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/50 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="rounded-full bg-white/20 p-3 ring-1 ring-white/40 backdrop-blur-sm">
                <Expand className="h-6 w-6 text-white" aria-hidden="true" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="ছবি প্রিভিউ"
          onClick={closeLightbox}
          className="gallery-lightbox fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            aria-label="বন্ধ করুন"
            onClick={closeLightbox}
            autoFocus
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white sm:top-6 sm:right-6"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="আগের ছবি"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            className="absolute left-2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white sm:left-6 sm:p-3"
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" aria-hidden="true" />
          </button>

          <figure
            onClick={(event) => event.stopPropagation()}
            className="flex max-w-full flex-col items-center gap-4"
          >
            <Image
              key={activeIndex}
              src={items[activeIndex].img}
              alt={items[activeIndex].alt}
              loading="eager"
              className="max-h-[75vh] w-auto max-w-[92vw] rounded-lg object-contain"
            />
            <figcaption className="font-bangla text-sm text-white/80">
              {activeIndex + 1} / {items.length}
            </figcaption>
          </figure>

          <button
            type="button"
            aria-label="পরের ছবি"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white sm:right-6 sm:p-3"
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallery;
