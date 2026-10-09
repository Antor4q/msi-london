"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Brand = {
  name: string;
  href: string;
  /** optional monochrome SVG/PNG logo. Without it the name shows as a serif wordmark. */
  logo?: string;
};

// Placeholder names, replace with your real brands (keep it to 8, 12 or 16 so the grid stays even)
const BRANDS: Brand[] = [
  { name: "Maison Aldo", href: "/brands/maison-aldo" },
  { name: "Nordform", href: "/brands/nordform" },
  { name: "Casa Verro", href: "/brands/casa-verro" },
  { name: "Atelier Holt", href: "/brands/atelier-holt" },
  { name: "Lumen & Co", href: "/brands/lumen-and-co" },
  { name: "Studio Marlowe", href: "/brands/studio-marlowe" },
  { name: "Vessel", href: "/brands/vessel" },
  { name: "Halden", href: "/brands/halden" },
];

export default function Brands() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // NOTE: age ekhane sudhu "reduce" condition chhilo, tai callback
      // normal user der jonno cholto-i na. Ekhon "no-preference" e chole,
      // reduced-motion user der jonno kono motion hoy na.
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)" },
        () => {
          const cells = gsap.utils.toArray<HTMLElement>(
            "[data-brand]",
            root.current
          );
          gsap.set(cells, { y: 30, opacity: 0 });

          ScrollTrigger.batch(cells, {
            start: "top 92%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.07,
              }),
          });
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className="mx-auto w-full max-w-[1500px] pb-16 md:pb-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-playfair text-[clamp(2.25rem,10vw,3.5rem)] font-bold uppercase leading-none tracking-tight md:text-[clamp(3rem,7vw,6rem)]">
            Brands we work with
          </h2>
        </div>
      </div>

      {/* Hairline grid: outer top/left border + each cell's right/bottom border.
          Mobile 2 col, md+ 4 col */}
      <ul className="mt-10 grid grid-cols-2 border-l border-t border-[#1f1f1d]/15 sm:mt-12 md:mt-16 md:grid-cols-4">
        {BRANDS.map((b) => (
          <li
            key={b.name}
            data-brand
            className="border-b border-r border-[#1f1f1d]/15"
          >
            <Link
              href={b.href}
              aria-label={b.name}
              className="group relative flex min-h-[110px] flex-col items-center justify-center px-3 py-8 outline-none transition-colors duration-500 hover:bg-white focus-visible:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1f1f1d] min-[400px]:min-h-[130px] min-[400px]:px-4 min-[400px]:py-10 sm:min-h-[150px] md:min-h-[210px] motion-reduce:transition-none"
            >
              {b.logo ? (
                <Image
                  src={b.logo}
                  alt=""
                  width={160}
                  height={48}
                  className="h-7 w-auto max-w-[85%] object-contain opacity-55 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 min-[400px]:h-8 md:h-10"
                />
              ) : (
                <span className="text-center font-serif text-[15px] uppercase tracking-[0.12em] text-[#2b2b28]/55 transition-colors duration-500 group-hover:text-[#2b2b28] group-focus-visible:text-[#2b2b28] min-[400px]:text-lg sm:text-xl md:text-lg lg:text-xl xl:text-2xl">
                  {b.name}
                </span>
              )}

              <span
                aria-hidden
                className="absolute bottom-5 hidden translate-y-1 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:block motion-reduce:transition-none"
              >
                <span className="relative inline-block pb-1 text-xs tracking-widest text-[#2b2b28]">
                  VIEW BRAND
                  <span className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-[#1f1f1d] transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}