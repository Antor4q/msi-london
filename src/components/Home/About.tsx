"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

/**
 * Parallax in px (y), symmetric around 0 so at the middle of the scroll
 * everything sits exactly like the design.
 * `heading` and `imageRight` share the SAME values on purpose: their top
 * edges stay aligned the whole time. The depth comes from the left image
 * and the text moving at different speeds.
 */
const LAYERS = {
  heading: { from: 70, to: -70 },
  imageRight: { from: 70, to: -70 },
  imageLeft: { from: 25, to: -25 },
  text: { from: 45, to: -45 },
};

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const k = ctx.conditions?.desktop ? 1 : 0.4; // softer on mobile

        const scrollConfig = {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        };

        (Object.keys(LAYERS) as (keyof typeof LAYERS)[]).forEach((key) => {
          const el = section.querySelector<HTMLElement>(`[data-layer="${key}"]`);
          if (!el) return;
          gsap.fromTo(
            el,
            { y: LAYERS[key].from * k },
            { y: LAYERS[key].to * k, ease: "none", scrollTrigger: scrollConfig }
          );
        });

        // Slow drift of the photo inside its frame
        section.querySelectorAll<HTMLElement>("[data-inner]").forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -7, scale: 1.16 },
            { yPercent: 7, scale: 1.16, ease: "none", scrollTrigger: scrollConfig }
          );
        });
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white px-6 py-24 text-[#2e2a25] md:pl-[7%] md:pr-[5.4%] md:py-32"
    >
      {/*
        Two columns: left 46.5% / right 53.5% (matches the design).
        Both columns start at the same top, so heading top === right image top.
      */}
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-y-12 md:grid-cols-[46.5%_53.5%] md:items-start md:gap-y-0">
        {/* LEFT: heading, then image underneath */}
        <div className="flex flex-col">
          <div data-layer="heading" className="will-change-transform">
            <h2
              className={`${playfair.className} text-[clamp(3.5rem,9vw,7rem)] font-medium leading-[0.9] tracking-tight`}
            >
              ABOUT US
            </h2>
          </div>

          <div
            data-layer="imageLeft"
            className="mt-12 w-full will-change-transform md:w-[80%]"
          >
            <div className="relative aspect-[575/400] w-full overflow-hidden">
              <Image
                data-inner
                src="/ab1.jpg"
                alt="Cream bouclé sofa on a walnut base"
                fill
                sizes="(min-width: 768px) 37vw, 100vw"
                className="object-cover will-change-transform"
                priority
              />
            </div>
          </div>
        </div>

        {/* RIGHT: image at the very top (aligned with heading), text below */}
        <div className="flex flex-col">
          <div
            data-layer="imageRight"
            className="will-change-transform md:ml-auto md:w-[64%]"
          >
            <div className="relative aspect-[530/418] w-full overflow-hidden">
              <Image
                data-inner
                src="/ab2.jpg"
                alt="Interior lounge with green accent chairs"
                fill
                sizes="(min-width: 768px) 34vw, 100vw"
                className="object-cover will-change-transform"
              />
            </div>
          </div>

          <div data-layer="text" className="mt-12 will-change-transform">
            <p
              className={`${playfair.className} text-[clamp(1.6rem,2.7vw,2.5rem)] font-semibold leading-[1.2]`}
            >
              MSI London is a furniture and interiors supplier based in Barnet,
              London. We work with interior designers, architects, contractors.
            </p>

            <a
              href="/about"
              className="mt-8 inline-block bg-[#2e2a25] px-10 py-4 font-sans text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#4a443c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2e2a25]"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}