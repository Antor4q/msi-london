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
    src: "/so1.jpg",
    alt: "Designer reviewing material samples at a table",
  },
  // 2,6,10,11,13,16
  {
    no: "02",
    title: "Furniture",
    text: "Sofas, chairs, tables and storage sourced from trusted luxury makers, matched to your brief and budget.",
    src: "/so2.jpg",
    alt: "Cream sofa in a styled living room",
  },
  {
    no: "03",
    title: "Lighting",
    text: "Statement pendants, floor lamps and architectural lighting selected to finish the room, not just fill it.",
    src: "/so3.jpg",
    alt: "Linen floor lamp beside an armchair",
  },
  {
    no: "04",
    title: "Kitchens & Joinery",
    text: "Fitted kitchens and bespoke joinery, planned with your contractors and made to fit the space exactly.",
    src: "/so4.jpg",
    alt: "Oak kitchen cabinetry with stone worktop",
  },
  {
    no: "05",
    title: "Blinds & Window Treatments",
    text: "Curtains, blinds and shutters made to measure, in fabrics that suit the light and the interior.",
    src: "/so5.jpg",
    alt: "Linen curtains in a bright room",
  },
  {
    no: "06",
    title: "Delivery & Installation",
    text: "Careful delivery, white-glove placement and full installation, coordinated around your site schedule.",
    src: "/so6.jpg",
    alt: "Furniture being carried into a finished interior",
  },
];

export default function WhatWeSource() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // NOTE: age ekhane sudhu "reduce" condition chhilo, tai callback
      // normal user der jonno cholto-i na. Ekhon "no-preference" e chole,
      // reduced-motion e kono motion hoy na (sticky stacking CSS e thake).
      mm.add(
        {
          desktop:
            "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile:
            "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { desktop } = context.conditions as { desktop: boolean };
          const k = desktop ? 1 : 0.6; // mobile e motion halka
          const shrink = desktop ? 0.94 : 0.96;

          // Title drifts slower than the page (jodi [data-title] thake)
          if (root.current?.querySelector("[data-title]")) {
            gsap.fromTo(
              "[data-title]",
              { y: 50 * k },
              {
                y: -50 * k,
                ease: "none",
                scrollTrigger: {
                  trigger: "[data-title]",
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }

          const rows = gsap.utils.toArray<HTMLElement>(
            "[data-row]",
            root.current
          );

          rows.forEach((row, i) => {
            const inner = row.querySelector("[data-inner]");
            const shade = row.querySelector("[data-shade]");
            const img = row.querySelector("[data-parallax]");
            const next = rows[i + 1];

            // Image parallax runs for the whole time this card is on screen
            gsap.fromTo(
              img,
              { yPercent: -8 * k },
              {
                yPercent: 8 * k,
                ease: "none",
                scrollTrigger: {
                  trigger: row,
                  start: "top bottom",
                  endTrigger: next ?? root.current,
                  end: next ? "top 25%" : "bottom bottom",
                  scrub: true,
                  invalidateOnRefresh: true,
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
                invalidateOnRefresh: true,
              };
              gsap.to(inner, {
                scale: shrink,
                transformOrigin: "center top",
                ease: "none",
                scrollTrigger: trigger,
              });
              gsap.to(shade, {
                opacity: 0.14,
                ease: "none",
                scrollTrigger: trigger,
              });
            }
          });
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className="mx-auto w-full max-w-[1500px] pb-16 md:pb-24">
      <h2 className="font-playfair text-[clamp(3rem,7vw,6rem)] font-bold uppercase leading-none tracking-tight">
        what we source
      </h2>

      {/* Each card is sticky, so the next one slides up and sits on top.
          No ancestor of this list may have overflow-hidden.
          Sticky shudhu tokhon e hoy jokhon screen height >= 640px;
          choto height (landscape phone) e card gulo normal flow e thake,
          jate lomba card er niche ongsho kete na jay. */}
      <ul className="mt-10 flex flex-col gap-6 [--stack-top:5.5rem] sm:mt-14 md:mt-20 md:gap-[12vh] md:[--stack-top:7rem]">
        {SERVICES.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <li
              key={s.no}
              data-row
              className="[@media(min-height:640px)]:sticky"
              style={{ top: `calc(var(--stack-top) + ${i * 14}px)` }}
            >
              <div
                data-inner
                className="group relative grid items-center gap-5 bg-white p-3 min-[400px]:gap-6 min-[400px]:p-4 md:grid-cols-12 md:gap-0 md:p-8"
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
                  <span className="text-[16px] font-bold tabular-nums tracking-widest text-[#2b2b28]/60 md:text-[18px]">
                    {s.no}
                  </span>

                  <h3 className="mt-3 font-arial text-[1.625rem] font-medium leading-tight text-[#2b2b28] min-[400px]:text-3xl md:mt-4 md:text-3xl lg:text-4xl">
                    <span className="relative inline-block pb-1.5">
                      {s.title}
                      <span
                        aria-hidden
                        className="absolute bottom-0 left-0 h-[1.5px] w-full origin-right scale-x-0 bg-[#1f1f1d] transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100 motion-reduce:transition-none"
                      />
                    </span>
                  </h3>

                  <p className="mt-4 max-w-[44ch] font-arial text-[14px] font-medium leading-[1.5] tracking-[-0.01em] text-[#2b2b28]/75 sm:text-[15px] md:mt-5 md:text-[16px] md:leading-[1.3] lg:text-[18px]">
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