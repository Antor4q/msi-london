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
 * 6 featured products = 3 columns x 2 products.
 * Everything below is PLACEHOLDER content, replace with real products.
 * Images go in /public/images/featured/ : each product has a main image and a
 * second angle (`imageAlt`) that fades in on hover.
 */
type Product = {
  name: string;
  material: string;
  price: string;
  image: string;
  imageAlt: string;
  ratio: string; // tailwind aspect class, mixed ratios give the grid its rhythm
  href: string;
};

const COLUMNS: Product[][] = [
  [
    {
      name: "Cloud Bouclé Sofa",
      material: "Bouclé fabric, solid walnut base",
      price: "Trade price on request",
      image: "/se1.jpg",
      imageAlt: "/se1.jpg",
      ratio: "aspect-[4/5]",
      href: "/products/cloud-boucle-sofa",
    },
    {
      name: "Travertine Coffee Table",
      material: "Honed travertine, brass detail",
      price: "Trade price on request",
      image: "/se2.jpg",
      imageAlt: "/se2.jpg",
      ratio: "aspect-square",
      href: "/products/travertine-coffee-table",
    },
  ],
  [
    {
      name: "Walnut Lounge Chair",
      material: "Velvet upholstery, walnut frame",
      price: "Trade price on request",
      image: "/se3.jpg",
      imageAlt: "/se3.jpg",
      ratio: "aspect-square",
      href: "/products/walnut-lounge-chair",
    },
    {
      name: "Ribbed Sideboard",
      material: "Fluted oak veneer, soft-close doors",
      price: "Trade price on request",
      image: "/se4.jpg",
      imageAlt: "/se4.jpg",
      ratio: "aspect-[4/5]",
      href: "/products/ribbed-sideboard",
    },
  ],
  [
    {
      name: "Arc Floor Lamp",
      material: "Brushed brass, marble base",
      price: "Trade price on request",
      image: "/se1.jpg",
      imageAlt: "/se1.jpg",
      ratio: "aspect-[4/5]",
      href: "/products/arc-floor-lamp",
    },
    {
      name: "Oak Dining Table",
      material: "Solid oak, seats eight",
      price: "Trade price on request",
      image: "/se2.jpg",
      imageAlt: "/se2.jpg",
      ratio: "aspect-square",
      href: "/products/oak-dining-table",
    },
  ],
];

/**
 * Parallax per column (px, symmetric around 0).
 * Outer columns move a lot, the middle one barely moves: columns drift apart
 * and back together as you scroll, so cards never sit on one flat line.
 */
const COLUMN_PARALLAX = [
  { from: 80, to: -80 },
  { from: 20, to: -20 },
  { from: 110, to: -110 },
];

export default function FeaturedSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const scrollConfig = {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      };

      section.querySelectorAll<HTMLElement>("[data-col]").forEach((col) => {
        const i = Number(col.dataset.col);
        gsap.fromTo(
          col,
          { y: COLUMN_PARALLAX[i].from },
          { y: COLUMN_PARALLAX[i].to, ease: "none", scrollTrigger: scrollConfig }
        );
      });

      // Soft drift of each photo inside its frame
      section.querySelectorAll<HTMLElement>("[data-inner]").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -5, scale: 1.12 },
          { yPercent: 5, scale: 1.12, ease: "none", scrollTrigger: scrollConfig }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white px-6 py-24 text-[#2e2a25] md:px-[7%] md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        {/* Heading row */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2
            className={`${playfair.className} text-[clamp(3rem,7vw,6rem)] font-bold leading-none tracking-tight`}
          >
            FEATURED
          </h2>

          <div className="flex flex-col items-start gap-6 md:max-w-[34ch]">
            <p className={`${inter.className} text-[15px] font-medium leading-relaxed`}>
              A selection of pieces our trade clients specify most often.
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#2e2a25] px-10 py-4 font-sans text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#4a443c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2e2a25]"
            >
              View all products
            </Link>
          </div>
        </div>

        {/*
          Grid: 1 col mobile, 2 col tablet, 3 col desktop.
          Below lg the column wrappers use `contents`, so cards simply flow in order.
        */}
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-x-[3vw]">
          {COLUMNS.map((column, colIndex) => (
            <div
              key={colIndex}
              data-col={colIndex}
              className="contents will-change-transform lg:flex lg:flex-col lg:gap-y-20"
            >
              {column.map((p) => (
                <article key={p.name}>
                  <Link
                    href={p.href}
                    className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2e2a25]"
                  >
                    <div className={`relative w-full overflow-hidden bg-[#e4e1da] ${p.ratio}`}>
                      <div data-inner className="absolute inset-0 will-change-transform">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                          className="object-cover"
                        />
                        {/* Second angle fades in on hover / keyboard focus */}
                        <Image
                          src={p.imageAlt}
                          alt=""
                          aria-hidden
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                          className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
                        />
                      </div>
                    </div>

                    <h3
                      className={`${playfair.className} mt-5 text-[clamp(1.5rem,2vw,2rem)] font-semibold leading-tight`}
                    >
                      {p.name}
                    </h3>
                    <p className={`${inter.className} mt-1 text-[15px] font-medium leading-relaxed`}>
                      {p.material}
                    </p>

                    <div className={`${inter.className} mt-3 flex items-center justify-between text-sm`}>
                      <span className="font-medium opacity-60">{p.price}</span>
                      <span className="relative font-semibold">
                        Enquire
                        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#2e2a25] transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}