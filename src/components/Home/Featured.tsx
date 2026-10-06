"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Product = {
  name: string;
  price: string;
  href: string;
  src: string;
  alt: string;
  /** grid span + vertical offset (static strings so Tailwind can see them) */
  cell: string;
  /** image shape, this is what makes every card a different size */
  aspect: string;
  /** px the whole card drifts up/down while scrolling (desktop only) */
  drift: number;
};

const PRODUCTS: Product[] = [
  {
    name: "Oak Dining Table",
    price: "$1,490",
    href: "/products/oak-dining-table",
    src: "/pr6.jpg",
    alt: "Solid oak dining table with tapered legs",
    cell: "col-span-2 md:col-span-5",
    aspect: "aspect-[6/5]",
    drift: 22
  },
  {
    name: "Bouclé Curved Sofa",
    price: "$2,350",
    href: "/products/boucle-curved-sofa",
    src: "/pr2.jpg",
    alt: "Cream bouclé curved sofa",
    cell: "col-span-1 md:col-span-4 md:mt-20",
    aspect: "aspect-square",
    drift: -14
  },
  {
    name: "Stoneware Bowl Set",
    price: "$96",
    href: "/products/stoneware-bowl-set",
    src: "/pr11.avif",
    alt: "Set of four matte stoneware bowls",
    cell: "col-span-1 md:col-span-3 md:mt-8",
    aspect: "aspect-[3/4]",
    drift: 18
  },
  {
    name: "Rattan Armchair",
    price: "$780",
    href: "/products/rattan-armchair",
    src: "/pr10.avif",
    alt: "Teak armchair with woven rattan back",
    cell: "col-span-2 md:col-span-5",
    aspect: "aspect-[4/3]",
    drift: -10
  },
  {
    name: "Linen Floor Lamp",
    price: "$210",
    href: "/products/linen-floor-lamp",
    src: "/pr16.jpg",
    alt: "Floor lamp with a linen shade and oak stand",
    cell: "col-span-1 md:col-span-3 md:mt-14",
    aspect: "aspect-[4/5]",
    drift: 20
  }, 
  {
    name: "Walnut Side Table",
    price: "$420",
    href: "/products/walnut-side-table",
    src: "/pr13.avif",
    alt: "Round walnut side table",
    cell: "col-span-1 md:col-span-4 md:mt-6",
    aspect: "aspect-[4/5] md:aspect-square",
    drift: -16
  },
];

export default function FeaturedProducts() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduce } = context.conditions as {
            desktop: boolean;
            reduce: boolean;
          };
          const cards = gsap.utils.toArray<HTMLElement>(
            "[data-product]",
            root.current
          );

          // Scroll entrance: each card reveals when it reaches the viewport
          if (!reduce) {
            gsap.set(cards, { y: 60, opacity: 0 });
            ScrollTrigger.batch(cards, {
              start: "top 88%",
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  y: 0,
                  opacity: 1,
                  duration: 0.9,
                  ease: "power3.out",
                  stagger: 0.1,
                }),
            });
          }

          if (reduce) return;

          // Parallax 1: title drifts slower than the page
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

          // Parallax 2: image moves inside its frame
          cards.forEach((card) => {
            const inner = card.querySelector("[data-parallax]");
            gsap.fromTo(
              inner,
              { yPercent: -8 },
              {
                yPercent: 8,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );

            // Parallax 3: whole card drifts at its own speed (desktop only)
            if (desktop) {
              const link = card.querySelector<HTMLElement>("[data-drift]");
              const d = Number(link?.dataset.drift ?? 0);
              gsap.fromTo(
                link,
                { y: d },
                {
                  y: -d,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                  },
                }
              );
            }
          });
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root} className="mx-auto w-full max-w-[1500px]  md:py-22 py-16">
     <h2
          className={`font-playfair text-[clamp(3rem,7vw,6rem)] font-bold leading-none tracking-tight`}
        >
          FEATURED PRODUCTS
        </h2>


      <ul className="mt-14 grid grid-cols-2 items-start gap-3 md:mt-16 md:grid-cols-12 md:gap-x-6 md:gap-y-10">
        {PRODUCTS.map((p) => (
          <li key={p.name} data-product className={p.cell}>
            <Link
              href={p.href}
              data-drift={p.drift}
              className="group block bg-white p-3 outline-none border border-[#f5f5f5] md:p-4"
            >
              <div
                className={`relative w-full overflow-hidden bg-[#ececea] ${p.aspect}`}
              >
                <div
                  data-parallax
                  className="absolute inset-x-0 -top-[12%] h-[124%]"
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between gap-3">
                <span className="relative font-arial font-medium inline-block pb-1 text-sm tracking-wide text-[#2b2b28] md:text-2xl">
                  {p.name}
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 h-[1.5px] w-full origin-right scale-x-0 bg-[#1f1f1d] transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100 motion-reduce:transition-none"
                  />
                </span>
                <span className="text-sm md:text-3xl font-arial font-medium tabular-nums text-[#2b2b28]">
                  {p.price}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}