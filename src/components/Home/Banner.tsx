"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bg from "@/public/ban.jpg";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // Motion kom chaile shob kichu static thakbe
      if (reduceMotion) {
        gsap.set(
          [
            bgRef.current,
            titleRef.current,
            descriptionRef.current,
            buttonRef.current,
          ],
          { clearProps: "all" }
        );
        return;
      }

      // =========================
      // Initial Entrance Animation
      // =========================
      const intro = gsap.timeline();

      intro
        .fromTo(
          bgRef.current,
          { scale: 1.15 },
          { scale: 1, duration: 1.8, ease: "power3.out" }
        )
        .fromTo(
          titleRef.current,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" },
          "-=1.1"
        )
        .fromTo(
          descriptionRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
          "-=0.8"
        )
        .fromTo(
          buttonRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.6"
        );

      // =========================
      // Parallax (mobile e halka, desktop e full)
      // =========================
      const mm = gsap.matchMedia();

      const addParallax = (
        target: Element | null,
        vars: gsap.TweenVars,
        scrub: number
      ) => {
        if (!target) return;
        gsap.to(target, {
          ...vars,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub,
            invalidateOnRefresh: true,
          },
        });
      };

      mm.add("(min-width: 768px)", () => {
        addParallax(bgRef.current, { yPercent: 12, scale: 1.12 }, 1.2);
        addParallax(titleRef.current, { yPercent: -18 }, 1);
        addParallax(descriptionRef.current, { yPercent: -30 }, 1.2);
        addParallax(buttonRef.current, { yPercent: -20 }, 1);
      });

      mm.add("(max-width: 767px)", () => {
        addParallax(bgRef.current, { yPercent: 8, scale: 1.08 }, 1);
        addParallax(titleRef.current, { yPercent: -8 }, 1);
        addParallax(descriptionRef.current, { yPercent: -10 }, 1);
        addParallax(buttonRef.current, { yPercent: -8 }, 1);
      });
    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#222]"
    >
      {/* =========================
          Background Image
      ========================= */}
      <div
        ref={bgRef}
        className="absolute -inset-[8%] z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${bg.src}')` }}
      />

      {/* =========================
          Dark Overlay
      ========================= */}
      <div className="absolute inset-0 z-[1] bg-black/40 md:bg-black/35" />

      {/* =========================
          Hero Content
      ========================= */}
      <div className="relative z-[2] mx-auto flex min-h-[100svh] w-full max-w-[1920px] flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-[9.5vw]">
        {/* =========================
            Description (position same as original)
        ========================= */}
        <div className="absolute right-[6%] top-[29%] w-[48%] max-w-[590px] sm:right-[7%] sm:w-[43%] md:right-[8%] md:w-[40%] lg:right-[8.5%] lg:w-[38%]">
          <p
            ref={descriptionRef}
            className="font-arial text-[14px] font-bold leading-[1.3] tracking-[-0.01em] text-white sm:text-[15px] md:text-[16px] lg:text-[18px]"
          >
            Furniture sourcing and specification support for interior
            designers, architects and developers. Access trade discounts,
            showroom appointments and trusted suppliers for luxury interiors.
          </p>
        </div>

        {/* =========================
            Main Heading (3 rows)
        ========================= */}
        <div className="relative">
          <h1
            ref={titleRef}
            className="font-playfair text-[min(52px,13.5vw)] font-medium uppercase leading-[0.82] tracking-[-0.055em] text-white sm:text-[min(70px,13vw)] md:text-[min(105px,13vw)] lg:text-[min(150px,12vw)] xl:text-[min(180px,11.5vw)] 2xl:text-[min(190px,11.5vw)]"
          >
            <span className="block">Luxury</span>
            <span className="block">Furniture</span>
            <span className="block">For Spaces</span>
          </h1>

            {/* =========================
                CTA Button
            ========================= */}
            <Link
              ref={buttonRef}
              href="#collection"
              className="group absolute left-0 top-full z-10 mt-8 flex w-fit items-center bg-[#292823] px-7 py-4 font-arial text-[14px] font-bold text-white transition-all duration-500 hover:bg-[#372310] hover:text-white sm:mt-10 sm:px-8 sm:text-[15px] md:mt-12 md:px-9 md:py-[18px] md:text-[16px] lg:text-[18px]"
            >
              <span>Explore Collection</span>

              <span className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
        </div>

      </div>
    </section>
  );
};

export default Hero;