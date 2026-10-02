"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Playfair_Display, Inter } from "next/font/google";
import gsap from "gsap";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

/**
 * Content + image paths live here. Put your images in /public/images/source/
 * and just update `image` / `description` per item.
 * NOTE: only item 01 had a real description in the design; the rest are
 * placeholders, replace them with your final copy.
 */
const ITEMS = [
  {
    title: "Trade Service",
    image: "/se1.jpg",
    alt: "Wooden stool on a light grey background",
    description:
      "Furniture sourcing and specification support for interior designers, architects, and developers. Access trade discounts, showroom appointments, and trusted suppliers for luxury interiors.",
  },
  {
    title: "Furniture",
    image: "/se2.jpg",
    alt: "Furniture piece",
    description:
      "Sofas, chairs, tables and bespoke pieces sourced from trusted makers, matched to your project brief and budget.",
  },
  {
    title: "Lighting",
    image: "/se3.jpg",
    alt: "Lighting fixture",
    description:
      "Pendants, wall lights and lamps selected to suit each space, with specification support from concept to install.",
  },
  {
    title: "Kitchens & Joinery",
    image: "/se4.jpg",
    alt: "Kitchen and joinery detail",
    description:
      "Fitted kitchens and made-to-measure joinery, produced to your drawings and finished to a high standard.",
  },
  {
    title: "Blinds & Window Treatments",
    image: "/se2.jpg",
    alt: "Window treatment",
    description:
      "Blinds, curtains and shutters measured, made and fitted to complement the rest of the interior.",
  },
  {
    title: "Delivery & Installation",
    image: "/se1.jpg",
    alt: "Delivery and installation",
    description:
      "Coordinated delivery, careful handling and professional installation, so everything arrives and is placed correctly.",
  },
];

export default function SourceSection() {
  const [active, setActive] = useState(0);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const firstRender = useRef(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = reduce || firstRender.current ? 0 : 0.5;

    ITEMS.forEach((_, i) => {
      const img = imageRefs.current[i];
      const txt = textRefs.current[i];
      const isActive = i === active;
      if (!img || !txt) return;

      gsap.killTweensOf([img, txt, img.firstElementChild]);

      // Image crossfade + gentle settle-in on the new one
      gsap.to(img, {
        opacity: isActive ? 1 : 0,
        duration: d,
        ease: "power2.out",
        overwrite: true,
      });
      if (isActive && d > 0) {
        gsap.fromTo(
          img.firstElementChild,
          { scale: 1.08 },
          { scale: 1, duration: 0.9, ease: "power3.out" }
        );
      }

      // Description fade + tiny rise
      gsap.to(txt, {
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : 8,
        duration: d,
        delay: isActive && d > 0 ? 0.1 : 0,
        ease: "power2.out",
        overwrite: true,
      });
    });

    firstRender.current = false;
  }, [active]);

  return (
    <section className="bg-white px-6 pb-16 text-[#2e2a25] md:px-[5%] md:pb-22">
      <div className="mx-auto max-w-[1500px]">
        <h2
          className={`${playfair.className} text-[clamp(3rem,7vw,6rem)] font-bold leading-none tracking-tight`}
        >
          WHAT WE SOURCE
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-12 md:gap-8">
          {/* Left: list */}
          <ul className="md:col-span-7" onMouseLeave={() => undefined}>
            {ITEMS.map((item, i) => {
              const isActive = i === active;
              return (
                <li key={item.title} className="border-b border-[#2e2a25]/10 last:border-b-0">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-current={isActive}
                    className={`${playfair.className} flex w-full items-baseline gap-4 py-3 text-left text-[clamp(1.7rem,3.4vw,3.1rem)] font-semibold leading-tight transition-opacity duration-300 lining-nums focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2e2a25] ${
                      isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                    }`}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span>{item.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right: dynamic card */}
          <div className="bg-[#f3f0e9] p-5 md:col-span-5 md:p-8 md:self-start">
            <div className="relative aspect-[544/322] w-full overflow-hidden bg-[#e4e1da]">
              {ITEMS.map((item, i) => (
                <div
                  key={item.image}
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  className="absolute inset-0"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                  aria-hidden={i !== active}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 768px) 38vw, 100vw"
                    className="object-cover will-change-transform"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>

            {/* All descriptions stacked in one grid cell so height never jumps */}
            <div className="mt-6 grid" aria-live="polite">
              {ITEMS.map((item, i) => (
                <p
                  key={item.title}
                  ref={(el) => {
                    textRefs.current[i] = el;
                  }}
                  className={`${inter.className} col-start-1 row-start-1 max-w-[52ch] text-[15px] font-medium leading-relaxed`}
                  style={{ opacity: i === 0 ? 1 : 0 }}
                  aria-hidden={i !== active}
                >
                  {item.description}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}