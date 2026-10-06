"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Item = {
  name: string;
  href: string;
  src: string;
  alt: string;
  rotate: number; // fixed values, keep between -3 and 3
};

const ITEMS: Item[] = [
  {
    name: "Plywood Chair",
    href: "/collection/plywood-chair",
    src: "/col1.jpg",
    alt: "Moulded plywood lounge chair with splayed wooden legs",
    rotate: -3,
  },
  {
    name: "Curved Sofa",
    href: "/collection/curved-sofa",
    src: "/col2.jpg",
    alt: "Cream bouclé curved sofa",
    rotate: 2,
  },
  {
    name: "Ceramic Bowls",
    href: "/collection/ceramic-bowls",
    src: "/col3.jpg",
    alt: "Stack of four matte ceramic bowls",
    rotate: -2,
  },
  {
    name: "Rattan Armchair",
    href: "/collection/rattan-armchair",
    src: "/col4.jpg",
    alt: "Teak armchair with woven rattan seat and back",
    rotate: 3,
  },
];

export default function Collection() {
  const root = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          fine: "(hover: hover) and (pointer: fine)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, fine, reduce } = context.conditions as {
            desktop: boolean;
            fine: boolean;
            reduce: boolean;
          };

          const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
          const cleanups: Array<() => void> = [];

          // 1. Base tilt: only on desktop, mobile carousel stays straight
          cards.forEach((card) => {
            const frame = card.querySelector("[data-frame]");
            const rot = desktop ? Number(card.dataset.rotate) : 0;
            gsap.set(frame, { rotation: rot });
          });

          // 2. Scroll entrance with stagger (single orchestrated moment)
          if (!reduce) {
            gsap.from(cards, {
              y: 70,
              opacity: 0,
              duration: 1,
              ease: "power3.out",
              stagger: 0.14,
              scrollTrigger: {
                trigger: root.current,
                start: "top 75%",
                once: true,
              },
            });
          }

          // 3. Hover: straighten + scale up (desktop only)
          if (desktop && !reduce) {
            cards.forEach((card) => {
              const frame = card.querySelector("[data-frame]");
              const rot = Number(card.dataset.rotate);

              const enter = () => {
                gsap.set(card, { zIndex: 10 });
                gsap.to(frame, {
                  rotation: 0,
                  scale: 1.06,
                  duration: 0.6,
                  ease: "power3.out",
                  overwrite: "auto",
                });
              };
              const leave = () => {
                gsap.to(frame, {
                  rotation: rot,
                  scale: 1,
                  duration: 0.6,
                  ease: "power3.out",
                  overwrite: "auto",
                  onComplete: () => {
                    gsap.set(card, { zIndex: 1 });
                  },
                });
              };

              card.addEventListener("pointerenter", enter);
              card.addEventListener("pointerleave", leave);
              card.addEventListener("focusin", enter);
              card.addEventListener("focusout", leave);
              cleanups.push(() => {
                card.removeEventListener("pointerenter", enter);
                card.removeEventListener("pointerleave", leave);
                card.removeEventListener("focusin", enter);
                card.removeEventListener("focusout", leave);
              });
            });
          }

          // 4. Custom "View" cursor (mouse devices only)
          if (desktop && fine && cursor.current) {
            const el = cursor.current;
            gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0.6 });
            const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
            const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

            const move = (e: PointerEvent) => {
              xTo(e.clientX);
              yTo(e.clientY);
            };
            window.addEventListener("pointermove", move);
            cleanups.push(() => window.removeEventListener("pointermove", move));

            cards.forEach((card) => {
              const show = () =>
                gsap.to(el, {
                  opacity: 1,
                  scale: 1,
                  duration: 0.3,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              const hide = () =>
                gsap.to(el, {
                  opacity: 0,
                  scale: 0.6,
                  duration: 0.25,
                  ease: "power2.in",
                  overwrite: "auto",
                });
              card.addEventListener("pointerenter", show);
              card.addEventListener("pointerleave", hide);
              cleanups.push(() => {
                card.removeEventListener("pointerenter", show);
                card.removeEventListener("pointerleave", hide);
              });
            });
          }

          return () => cleanups.forEach((fn) => fn());
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
  <div ref={root} className="bg-[#E5E5E3] md:px-[5%] md:py-22 px-6 py-16">
  <div
      
      className="mx-auto flex w-full max-w-[1500px] flex-col"
    >
     <h2
          className={`font-playfair text-[clamp(3rem,7vw,6rem)] font-bold leading-none tracking-tight`}
        >
          OUR COLLECTION
        </h2>

      {/* Mobile: scroll-snap carousel. Desktop: tilted row. */}
      <ul
        className="
          mt-14 -mx-6 flex w-[calc(100%+3rem)] snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          md:mx-0 md:w-full md:snap-none md:items-start md:gap-5 md:overflow-visible md:px-0 md:py-8
        "
      >
        {ITEMS.map((item, i) => (
          <li
            key={item.name}
            data-card
            data-rotate={item.rotate}
            className={`relative w-[72%] shrink-0 snap-center md:w-auto md:flex-1 ${
              i % 2 === 1 ? "md:mt-12" : ""
            }`}
          >
            <Link
              href={item.href}
              className="group block outline-none"
              aria-label={`View ${item.name}`}
            >
              <div
                data-frame
                className="relative aspect-[4/5] w-full overflow-hidden bg-[#d9d9d6] will-change-transform group-focus-visible:ring-2 group-focus-visible:ring-[#1f1f1d] group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-[#E5E5E3]"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 22vw, 72vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-5 text-center relative font-arial font-medium pb-1 text-sm tracking-wide text-[#2b2b28] md:text-2xl">
                {item.name}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      

    

      {/* Custom cursor, hidden on touch devices */}
      {/* <div
        ref={cursor}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 hidden size-20 items-center justify-center rounded-full bg-[#1f1f1d] text-xs font-medium tracking-wide text-white opacity-0 md:flex"
      >
        View
      </div> */}
    </div>
  </div>
  );
}