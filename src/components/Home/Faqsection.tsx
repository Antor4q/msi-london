"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const INK = "#1F2623";

// ---- Content: ekhane edit koro ----
const title = "Frequently asked questions";

// Index of the item that is open on load. Use -1 to start with all closed.
const INITIAL_OPEN = 0;

const faqs: { q: string; a: string }[] = [
  {
    q: "How long does delivery take?",
    a: "In-stock pieces arrive within 5 to 10 working days. Made-to-order pieces take 6 to 8 weeks, and you will see the exact estimate on the product page before you pay.",
  },
  {
    q: "Do you assemble the furniture for me?",
    a: "Yes. Our delivery team carries the piece into the room you choose, assembles it and takes the packaging away. Assembly is included on sofas, beds, tables and storage.",
  },
  {
    q: "Can I return something if it doesn't fit my room?",
    a: "You can return any unused piece within 30 days of delivery. We collect it from your door. Made-to-order and custom-fabric pieces can only be returned if they arrive damaged.",
  },
  {
    q: "Can I see fabric and wood samples first?",
    a: "Yes. Order up to five free swatches from any product page and they reach you in two to three days. Colours look different on every screen, so we always suggest checking in your own light.",
  },
  {
    q: "What warranty do your pieces come with?",
    a: "Frames and joinery are covered for five years. Fabric, leather and finishes are covered for one year against defects. Normal wear and tear is not included.",
  },
  {
    q: "How do I care for upholstery and solid wood?",
    a: "Vacuum fabric weekly with a soft brush and blot spills straight away. Wipe wood with a dry or barely damp cloth and keep it out of direct sun. Each product page lists its own care steps.",
  },
  {
    q: "Do you offer interior design help?",
    a: "Yes. Send us photos and measurements of your room and a stylist will suggest layouts and pieces within two working days. The first consultation is free.",
  },
];
// -----------------------------------

export default function FaqSection() {
  const rootRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(
    INITIAL_OPEN >= 0 ? INITIAL_OPEN : null
  );

  // One entrance: dividing lines draw across, questions rise into place
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: "[data-list]", start: "top 80%", once: true },
        });
        tl.fromTo(
          "[data-line]",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.3,
            ease: "expo.out",
            stagger: 0.09,
            transformOrigin: "left center",
          }
        ).fromTo(
          "[data-q]",
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.09,
          },
          0.15
        );
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      aria-label={title}
      className="mx-auto w-full max-w-[1500px] pb-24"
      style={{ color: INK }}
    >
      <h2 className="mb-14 max-w-[16ch] text-balance font-playfair text-[clamp(3rem,7vw,6rem)] font-bold uppercase leading-none tracking-tight sm:mb-20">
        {title}
      </h2>

      <ul data-list>
        {faqs.map((item, i) => (
          <Item
            key={item.q}
            index={i}
            q={item.q}
            a={item.a}
            open={open === i}
            initiallyOpen={i === INITIAL_OPEN}
            onToggle={() => setOpen((cur) => (cur === i ? null : i))}
          />
        ))}
        <li aria-hidden>
          <div
            data-line
            className="h-px w-full"
            style={{ backgroundColor: INK, opacity: 0.18 }}
          />
        </li>
      </ul>
    </section>
  );
}

type ItemProps = {
  index: number;
  q: string;
  a: string;
  open: boolean;
  initiallyOpen: boolean;
  onToggle: () => void;
};

function Item({ index, q, a, open, initiallyOpen, onToggle }: ItemProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const panel = panelRef.current;
    const icon = iconRef.current;
    const ring = ringRef.current;
    if (!panel || !icon || !ring) return;

    // First run: only sync the icon, the panel height is already right via classes
    if (first.current) {
      first.current = false;
      gsap.set(icon, { rotate: open ? 45 : 0 });
      if (open) gsap.set(ring, { backgroundColor: INK, color: "#fff" });
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = (v: number) => (reduce ? 0 : v);

    gsap.to(panel, {
      height: open ? "auto" : 0,
      duration: d(0.65),
      ease: "power3.inOut",
    });
    gsap.to(icon, {
      rotate: open ? 45 : 0,
      duration: d(0.45),
      ease: "back.out(1.8)",
    });
    gsap.to(ring, {
      backgroundColor: open ? INK : "rgba(255,255,255,0)",
      color: open ? "#ffffff" : INK,
      duration: d(0.35),
      ease: "power2.out",
    });
  }, [open]);

  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <li>
      <div
        data-line
        aria-hidden
        className="h-px w-full"
        style={{ backgroundColor: INK, opacity: 0.18 }}
      />
      <h3>
        <button
          id={buttonId}
          type="button"
          data-q
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex w-full items-center justify-between gap-6 py-7 text-left focus-visible:outline-2 focus-visible:outline-offset-4 sm:py-9"
          style={{ outlineColor: INK }}
        >
          <span className="font-playfair text-2xl leading-snug sm:text-3xl">
            {q}
          </span>
          <span
            ref={ringRef}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full ring-1 ring-[#1F2623]/25 transition-shadow duration-300 group-hover:ring-[#1F2623]"
            style={{ color: INK }}
          >
            <svg
              ref={iconRef}
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="none"
              aria-hidden
            >
              <path
                d="M8 2v12M2 8h12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>
      </h3>
      <div
        ref={panelRef}
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`overflow-hidden ${initiallyOpen ? "" : "h-0"}`}
      >
        <p className="max-w-2xl pb-9 pr-16 text-base leading-relaxed opacity-70 sm:text-lg">
          {a}
        </p>
      </div>
    </li>
  );
}