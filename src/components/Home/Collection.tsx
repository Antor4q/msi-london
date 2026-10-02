"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display, Inter } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

/**
 * 4 collections. Names, counts and lines are PLACEHOLDERS, replace with real ones.
 * Put images in /public/images/collections/
 */
const COLLECTIONS = [
  {
    name: "Sofas & Seating",
    count: "24 pieces",
    line: "Sculpted sofas, lounge chairs and benches in bouclé, velvet and leather.",
    image: "/se1.jpg",
    alt: "Sculpted cream sofa",
    href: "/collections/seating",
  },
  {
    name: "Tables & Storage",
    count: "18 pieces",
    line: "Dining, coffee and side tables with sideboards in solid wood and stone.",
    image: "/se2.jpg",
    alt: "Wooden table",
    href: "/collections/tables",
  },
  {
    name: "Bedroom",
    count: "16 pieces",
    line: "Beds, headboards and bedside pieces designed for calm, layered rooms.",
    image: "/se3.jpg",
    alt: "Bedroom furniture",
    href: "/collections/bedroom",
  },
  {
    name: "Contract & Hospitality",
    count: "30 pieces",
    line: "Durable, specification-ready furniture for hotels, offices and developments.",
    image: "/se4.jpg",
    alt: "Hospitality lounge seating",
    href: "/collections/contract",
  },
];

export default function CollectionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!section || !wrapper || !track || !bar) return;

    const mm = gsap.matchMedia();

    // Desktop + motion allowed = pinned horizontal scroll.
    // Mobile / reduced motion = normal layout (no pin).
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const getDistance = () => track.scrollWidth - window.innerWidth;

      wrapper.style.overflowX = "hidden";

      const scrollBase = {
        trigger: section,
        start: "top top",
        end: () => "+=" + getDistance(),
        invalidateOnRefresh: true,
      };

      const slide = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: { ...scrollBase, pin: true, scrub: 1, anticipatePin: 1 },
      });

   

      // Photo drifts inside its frame while the card travels across the screen
      track.querySelectorAll<HTMLElement>("[data-img]").forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -8, scale: 1.2 },
          {
            xPercent: 8,
            scale: 1.2,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest("[data-card]"),
              containerAnimation: slide,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });

      return () => {
        wrapper.style.overflowX = "";
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#E6E6E4] py-16 text-[#2e2a25] md:flex md:h-screen md:flex-col md:py-24"
    >
      <div className="px-6 md:px-[7%] md:pt-16">
        <h2
          className={`${playfair.className} text-[clamp(3rem,7vw,6rem)] font-bold leading-none tracking-tight`}
        >
         OUR COLLECTION
        </h2>
      </div>

      <div ref={wrapperRef} className="mt-12 md:mt-0 md:flex md:flex-1 md:items-center md:overflow-x-auto">
        <ul
          ref={trackRef}
          className="flex flex-col gap-14 px-6 will-change-transform md:w-max md:flex-row md:gap-[6vw] md:px-[7%]"
        >
          {COLLECTIONS.map((c) => (
            <li
              key={c.name}
              data-card
              className="md:w-[40vw] md:max-w-[640px] md:shrink-0 md:even:translate-y-12"
            >
              <Link
                href={c.href}
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2e2a25]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e4e1da] md:aspect-auto md:h-[46vh]">
                  <Image
                    data-img
                    src={c.image}
                    alt={c.alt}
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover will-change-transform"
                  />
                </div>

                <div className="mt-5 flex items-baseline justify-between gap-6">
                  <h3
                    className={`${playfair.className} text-[clamp(1.6rem,2.4vw,2.4rem)] font-semibold leading-tight`}
                  >
                    {c.name}
                  </h3>
                  <span className={`${inter.className} shrink-0 text-sm font-medium opacity-60`}>
                    {c.count}
                  </span>
                </div>

                <p className={`${inter.className} mt-2 max-w-[48ch] text-[15px] font-medium leading-relaxed`}>
                  {c.line}
                </p>

                <span
                  className={`${inter.className} relative mt-4 inline-block text-sm font-semibold`}
                >
                  View collection
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#2e2a25] transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

     
    </section>
  );
}