import type { DetailedHTMLProps, HTMLAttributes } from "react";

// React 19 removed the deprecated `<marquee>` element from the built-in JSX
// intrinsics. The component relies on it, so re-declare it here.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      marquee: DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          behavior?: "scroll" | "slide" | "alternate";
          direction?: "left" | "right" | "up" | "down";
          scrollamount?: number;
          scrolldelay?: number;
          loop?: number;
        },
        HTMLElement
      >;
    }
  }
}
