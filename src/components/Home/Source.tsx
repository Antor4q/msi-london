"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Service = {
  no: string;
  title: string;
  text: string;
  src: string;
  alt: string;
};

const SERVICES: Service[] = [
  {
    no: "01",
    title: "Trade Service",
    text: "Dedicated account support and trade discounts for interior designers, architects and developers, from first specification to final invoice.",
    src: "/pr1.jpg",
    alt: "Designer reviewing material samples at a table",
  },
  // 2,6,10,11,13,16
  {
    no: "02",
    title: "Furniture",
    text: "Sofas, chairs, tables and storage sourced from trusted luxury makers, matched to your brief and budget.",
    src: "/pr3.jpg",
    alt: "Cream sofa in a styled living room",
  },
  {
    no: "03",
    title: "Lighting",
    text: "Statement pendants, floor lamps and architectural lighting selected to finish the room, not just fill it.",
    src: "/pr4.jpg",
    alt: "Linen floor lamp beside an armchair",
  },
  {
    no: "04",
    title: "Kitchens & Joinery",
    text: "Fitted kitchens and bespoke joinery, planned with your contractors and made to fit the space exactly.",
    src: "/pr5.jpg",
    alt: "Oak kitchen cabinetry with stone worktop",
  },
  {
    no: "05",
    title: "Blinds & Window Treatments",
    text: "Curtains, blinds and shutters made to measure, in fabrics that suit the light and the interior.",
    src: "/pr7.jpg",
    alt: "Linen curtains in a bright room",
  },
  {
    no: "06",
    title: "Delivery & Installation",
    text: "Careful delivery, white-glove placement and full installation, coordinated around your site schedule.",
    src: "/pr8.jpg",
    alt: "Furniture being carried into a finished interior",
  },
];

export default function WhatWeSource() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { reduce } = context.conditions as { reduce: boolean };
        if (reduce) return; // cards still stack (CSS sticky), just no motion

        // Title drifts slower than the page
        gsap.fromTo(
          "[data-title]",
          { y: 50 },
          {
            y: -50,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-title]",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root.current);

        rows.forEach((row, i) => {
          const inner = row.querySelector("[data-inner]");
          const shade = row.querySelector("[data-shade]");
          const img = row.querySelector("[data-parallax]");
          const next = rows[i + 1];

          // Image parallax runs for the whole time this card is on screen
          gsap.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top bottom",
                endTrigger: next ?? root.current,
                end: next ? "top 25%" : "bottom bottom",
                scrub: true,
              },
            }
          );

          // While the next card slides over this one: shrink + dim it
          if (next) {
            const trigger = {
              trigger: next,
              start: "top bottom",
              end: "top 25%",
              scrub: true,
            };
            gsap.to(inner, {
              scale: 0.94,
              transformOrigin: "center top",
              ease: "none",
              scrollTrigger: trigger,
            });
            gsap.to(shade, { opacity: 0.14, ease: "none", scrollTrigger: trigger });
          }
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className="mx-auto w-full max-w-[1500px]">
     <h2
          className={`font-playfair uppercase text-[clamp(3rem,7vw,6rem)] font-bold leading-none tracking-tight`}
        >
          what we source
        </h2>


      {/* Each card is sticky, so the next one slides up and sits on top.
          No ancestor of this list may have overflow-hidden. */}
      <ul className="mt-14 flex flex-col gap-6 [--stack-top:5.5rem] md:mt-20 md:gap-[12vh] md:[--stack-top:7rem]">
        {SERVICES.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <li
              key={s.no}
              data-row
              className="sticky"
              style={{ top: `calc(var(--stack-top) + ${i * 14}px)` }}
            >
              <div
                data-inner
                className="group relative grid items-center gap-6 bg-white p-4 md:grid-cols-12 md:gap-0 md:p-8"
              >
                <div
                  className={`relative aspect-[4/3] w-full overflow-hidden bg-[#ececea] md:col-span-6 md:row-start-1 ${
                    flip ? "md:col-start-7" : "md:col-start-1"
                  }`}
                >
                  <div
                    data-parallax
                    className="absolute inset-x-0 -top-[12%] h-[124%]"
                  >
                    <Image
                      src={s.src}
                      alt={s.alt}
                      fill
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div
                  className={`pb-2 md:col-span-5 md:row-start-1 md:pb-0 ${
                    flip ? "md:col-start-1 md:pl-4" : "md:col-start-8"
                  }`}
                >
                  <span className="text-[18px] font-bold tabular-nums tracking-widest text-[#2b2b28]/60">
                    {s.no}
                  </span>

                  <h3 className="mt-4 font-arial font-medium text-3xl text-[#2b2b28] md:text-4xl">
                    <span className="relative inline-block pb-1.5">
                      {s.title}
                      <span
                        aria-hidden
                        className="absolute bottom-0 left-0 h-[1.5px] w-full origin-right scale-x-0 bg-[#1f1f1d] transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100 motion-reduce:transition-none"
                      />
                    </span>
                  </h3>

                  <p className="mt-5 max-w-[44ch] font-arial text-[14px] font-medium leading-[1.3] tracking-[-0.01em] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[18px] text-[#2b2b28]/75">
                    {s.text}
                  </p>
                </div>

                {/* dims the card while the next one covers it */}
                <div
                  data-shade
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[#1f1f1d] opacity-0"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}