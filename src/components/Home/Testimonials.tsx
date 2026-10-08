"use client";

import { Fragment, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  rating: number; // 1 to 5
  /** optional customer photo. Without it, initials are shown. */
  avatar?: string;
};

// Fixed pull-quote on the left image. Replace with your own line.
const FIXED_QUOTE = "Furniture chosen with care, delivered with precision.";
const FIXED_IMAGE = "/pr5.jpg";

// SAMPLE copy written to look realistic. The people and studios below are fictional.
// Replace every entry with a REAL client quote (with their permission) before launch.
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We were specifying a full renovation in Hampstead and needed fourteen matching pieces from a maker with a long lead time. The team managed the entire order, kept us updated at every stage, and everything arrived on site exactly when promised.",
    name: "Eleanor Hayes",
    role: "Interior Designer, Studio Hayes",
    rating: 5,
    avatar: "/pr1.jpg",
  },
  {
    quote:
      "As an architect I need suppliers who understand a specification without being walked through it twice. The trade pricing is transparent, samples arrive quickly, and every question gets a clear, informed answer. It has saved my team hours on every project.",
    name: "Daniel Okafor",
    role: "Associate Architect, Okafor Partners",
    rating: 5,
    avatar: "/pr2.jpg",
  },
  {
    quote:
      "The quality of the pieces is consistently excellent, and the delivery crew treats each item as if it were going into their own home. Our clients have commented more than once on how smoothly the installation was handled.",
    name: "Priya Raman",
    role: "Founder, Raman Interiors",
    rating: 5,
    avatar: "/pr3.jpg",
  },
  {
    quote:
      "I visited the showroom with a rough brief and left with a clear plan. They guided us through fabrics, finishes and lead times, then handled delivery and installation across three properties. We now source most of our furniture through them.",
    name: "James Whitcombe",
    role: "Project Director, Whitcombe Developments",
    rating: 5,
    avatar: "/pr4.jpg",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div
      role="img"
      aria-label={`Rated ${rating} out of 5`}
      className="flex items-center gap-1"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          aria-hidden
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`size-4 md:size-[18px] ${
            i < rating ? "text-[#2b2b28]" : "text-[#2b2b28]/20"
          }`}
        >
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.1l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ person }: { person: Testimonial }) {
  const initials = person.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#ececea] md:size-14">
      {person.avatar ? (
        <Image
          src={person.avatar}
          alt={person.name}
          fill
          sizes="56px"
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="flex size-full items-center justify-center font-serif text-lg text-[#2b2b28]"
        >
          {initials}
        </span>
      )}
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const busy = useRef(false);
  const started = useRef(false);

  const [index, setIndex] = useState(0);
  const count = TESTIMONIALS.length;
  const current = TESTIMONIALS[index];

  const reduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Exit animation first, then swap the quote (the swap triggers the entrance below)
  const goTo = (next: number) => {
    const target = (next + count) % count;
    if (busy.current || target === index) return;
    busy.current = true;

    if (reduced()) {
      setIndex(target);
      return;
    }

    const q = gsap.utils.selector(root);
    gsap
      .timeline({ onComplete: () => setIndex(target) })
      .to(q("[data-word]"), {
        yPercent: -110,
        duration: 0.5,
        ease: "power3.in",
        stagger: 0.012,
      })
      .to(
        q("[data-meta]"),
        { opacity: 0, y: -10, duration: 0.35, ease: "power2.in" },
        "<",
      );
  };

  // Slider text: intro on first scroll, entrance on every change
  useGSAP(
    () => {
      const play = () => {
        busy.current = false;

        if (reduced()) {
          gsap.set("[data-word]", { yPercent: 0 });
          gsap.set("[data-meta]", { opacity: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          "[data-word]",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.018 },
        );
        gsap.fromTo(
          "[data-meta]",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.25 },
        );
      };

      if (!started.current) {
        gsap.set("[data-word]", { yPercent: 110 });
        gsap.set("[data-meta]", { opacity: 0 });
        ScrollTrigger.create({
          trigger: root.current,
          start: "top 70%",
          once: true,
          onEnter: () => {
            started.current = true;
            play();
          },
        });
      } else {
        play();
      }
    },
    { scope: root, dependencies: [index] },
  );

  // Created once: title drift, image parallax, fixed quote reveal
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
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
          },
        );

        gsap.fromTo(
          "[data-parallax]",
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-frame]",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        gsap.from("[data-fixed]", {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-frame]",
            start: "top 60%",
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-white">
      <div className="mx-auto max-w-[1500px] px- py-20">
        <h2
          data-title
          className="font-playfair uppercase text-[clamp(3rem,7vw,6rem)] font-bold leading-none tracking-tight"
        >
          What others Say
        </h2>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:gap-0">
          {/* Left: one fixed image with one fixed quote on it */}
          <div
            data-frame
            className="relative aspect-[4/3] w-full overflow-hidden bg-[#ececea] md:col-span-5 md:aspect-[6/5]"
          >
            <div
              data-parallax
              className="absolute inset-x-0 -top-[12%] h-[124%]"
            >
              <Image
                src={FIXED_IMAGE}
                alt="Finished interior styled with furniture from the collection"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* soft dark gradient so the white quote stays readable */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
            />

            <p
              data-fixed
              className="absolute inset-x-6 bottom-6 font-serif text-xl leading-[1.2] text-white md:inset-x-8 md:bottom-8 md:text-[28px]"
            >
              <span aria-hidden className="mr-1 text-white/70">
                “
              </span>
              {FIXED_QUOTE}
            </p>
          </div>

          {/* Right: quote slider (text only) */}
          <figure className="flex flex-col justify-between gap-8 md:col-span-6 md:col-start-7 md:gap-8">
            <div aria-live="polite" className="min-h-[260px] md:min-h-[280px]">
              <span
                aria-hidden
                className="block font-serif text-5xl leading-none text-[#2b2b28]/30 md:text-6xl"
              >
                “
              </span>

              <blockquote className="mt-2 font-serif text-xl leading-[1.3] text-[#2b2b28] md:text-[28px] md:leading-[1.25]">
                {current.quote.split(" ").map((word, i) => (
                  <Fragment key={`${index}-${i}`}>
                    <span className="inline-block overflow-hidden pb-[0.15em] align-top -mb-[0.15em]">
                      <span data-word className="inline-block">
                        {word}
                      </span>
                    </span>{" "}
                  </Fragment>
                ))}
              </blockquote>

              <div data-meta className="mt-6">
                <Stars rating={current.rating} />
              </div>
            </div>

            <div>
              <div className="h-px w-full bg-[#1f1f1d]/15" />

              <figcaption className="mt-5 flex items-center justify-between gap-6">
                <div data-meta className="flex items-center gap-4">
                  <Avatar person={current} />
                  <div>
                    <p className="text-[15px] tracking-wide text-[#2b2b28]">
                      {current.name}
                    </p>
                    <p className="mt-1 text-sm text-[#2b2b28]/60">
                      {current.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <span className="text-sm tabular-nums tracking-widest text-[#2b2b28]/60">
                    {pad(index + 1)} / {pad(count)}
                  </span>

                  <div className="flex">
                    <button
                      type="button"
                      aria-label="Previous testimonial"
                      onClick={() => goTo(index - 1)}
                      className="flex size-11 items-center justify-center border border-[#1f1f1d]/30 text-[#2b2b28] outline-none transition-colors duration-300 hover:bg-[#1f1f1d] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f1f1d] motion-reduce:transition-none"
                    >
                      <ArrowLeft/>
                     
                    </button>
                    <button
                      type="button"
                      aria-label="Next testimonial"
                      onClick={() => goTo(index + 1)}
                      className="-ml-px flex size-11 items-center justify-center border border-[#1f1f1d]/30 text-[#2b2b28] outline-none transition-colors duration-300 hover:bg-[#1f1f1d] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f1f1d] motion-reduce:transition-none"
                    >
                       <ArrowRight/>
                     
                    </button>
                  </div>
                </div>
              </figcaption>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}