"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type Hotspot = {
  id: string;
  name: string;
  /** short line under the name, e.g. material or dimensions */
  detail?: string;
  price: number;
  href: string;
  /** dot position on the image, in percent (0–100) */
  x: number;
  y: number;
  /** optional product thumbnail */
  thumb?: string;
};

const INK = "#1F2623";

// ---- Content: ekhane edit koro ----
const title = "Shop the look";
const currency = "USD";
const locale = "en-US";

const image = {
  src: "/shop.jpg",
  alt: "Living room styled with a boucle sofa, walnut coffee table and brass floor lamp",
};

// x / y = dot position on the image (percent of the visible area)
const hotspots: Hotspot[] = [
  {
    id: "sofa",
    name: "Alder 3-seater sofa",
    detail: "Boucle, oak legs",
    price: 1890,
    href: "/products/alder-sofa",
    x: 38,
    y: 62,
    thumb: "/pr3.jpg",
  },
  {
    id: "lamp",
    name: "Arc floor lamp",
    detail: "Brushed brass",
    price: 340,
    href: "/products/arc-floor-lamp",
    x: 24,
    y: 77,
    thumb: "/pr2.jpg",
  },
  {
    id: "table",
    name: "Pebble coffee table",
    detail: "Solid walnut",
    price: 620,
    href: "/products/pebble-table",
    x: 72,
    y: 78,
    thumb: "/pr4.jpg",
  },
  {
    id: "chair",
    name: "Moro lounge chair",
    detail: "Linen, ash frame",
    price: 780,
    href: "/products/moro-chair",
    x: 64,
    y: 56,
    thumb: "/pr5.jpg",
  },
];
// -----------------------------------

export default function ShopTheLook() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const activeId = hovered ?? pinned;

  const fmt = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
    []
  );

  const enter = useCallback((id: string) => {
    clearTimeout(leaveTimer.current);
    setHovered(id);
  }, []);

  const leave = useCallback(() => {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setHovered(null), 160);
  }, []);

  const toggle = useCallback(
    (id: string) => {
      if (pinned === id) {
        setPinned(null);
        setHovered(null);
      } else {
        setPinned(id);
      }
    },
    [pinned]
  );

  // Escape closes, click outside the image unpins
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPinned(null);
        setHovered(null);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!stageRef.current?.contains(e.target as Node)) setPinned(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      clearTimeout(leaveTimer.current);
    };
  }, []);

  // Entrance: image wipes open, then dots pop in one by one
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top 75%",
            once: true,
          },
        });
        tl.fromTo(
          "[data-img]",
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.3,
            ease: "expo.out",
            clearProps: "clipPath",
          }
        )
          .fromTo(
            "[data-img] img",
            { scale: 1.16 },
            { scale: 1, duration: 1.8, ease: "power3.out" },
            0
          )
          .fromTo(
            "[data-dot]",
            { scale: 0, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 0.7,
              ease: "back.out(2.4)",
              stagger: 0.14,
            },
            "-=0.6"
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
      className="mx-auto w-full max-w-[1500px]  py-24"
      style={{ color: INK }}
    >
      <h2 className="font-playfair uppercase text-[clamp(3rem,7vw,6rem)] font-bold leading-none tracking-tight mb-10">
        {title}
      </h2>

      {/* Height: change aspect ratio here (bigger 2nd number = taller) */}
      <div
        ref={stageRef}
        className="relative aspect-[4/3] w-full md:aspect-[5/2]"
      >
        <div data-img className="absolute inset-0 overflow-hidden bg-neutral-200">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1500px) 1500px, 100vw"
            className="object-cover"
          />
        </div>

        {hotspots.map((spot) => (
          <Marker
            key={spot.id}
            spot={spot}
            price={fmt.format(spot.price)}
            active={activeId === spot.id}
            dimmed={activeId !== null && activeId !== spot.id}
            onEnter={() => enter(spot.id)}
            onLeave={leave}
            onToggle={() => toggle(spot.id)}
          />
        ))}
      </div>
    </section>
  );
}

type MarkerProps = {
  spot: Hotspot;
  price: string;
  active: boolean;
  dimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onToggle: () => void;
};

function Marker({
  spot,
  price,
  active,
  dimmed,
  onEnter,
  onLeave,
  onToggle,
}: MarkerProps) {
  const coreRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Card opens toward the side of the image that has room
  const right = spot.x < 58;
  const below = spot.y < 55;
  const origin = `${right ? "left" : "right"} ${below ? "top" : "bottom"}`;

  useEffect(() => {
    const card = cardRef.current;
    const core = coreRef.current;
    const icon = iconRef.current;
    if (!card || !core || !icon) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = (v: number) => (reduce ? 0 : v);

    if (active) {
      gsap.to(card, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: t(0.55),
        ease: "expo.out",
        overwrite: "auto",
      });
      gsap.to(core, {
        scale: 1.12,
        backgroundColor: INK,
        color: "#ffffff",
        duration: t(0.35),
        ease: "power3.out",
      });
      gsap.to(icon, { rotate: 45, duration: t(0.4), ease: "back.out(2)" });
    } else {
      gsap.to(card, {
        autoAlpha: 0,
        y: 10,
        scale: 0.96,
        duration: t(0.25),
        ease: "power2.in",
        overwrite: "auto",
      });
      gsap.to(core, {
        scale: 1,
        backgroundColor: "rgba(255,255,255,0.92)",
        color: INK,
        duration: t(0.3),
        ease: "power2.out",
      });
      gsap.to(icon, { rotate: 0, duration: t(0.3), ease: "power2.out" });
    }
  }, [active]);

  return (
    <div
      className="absolute"
      style={{
        left: `${spot.x}%`,
        top: `${spot.y}%`,
        zIndex: active ? 30 : 10,
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && onEnter()}
      onPointerLeave={(e) => e.pointerType === "mouse" && onLeave()}
      onFocus={onEnter}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          onLeave();
      }}
    >
      <button
        type="button"
        data-dot
        onClick={onToggle}
        aria-expanded={active}
        aria-controls={`look-${spot.id}`}
        aria-label={`${spot.name}, ${price}`}
        className="relative -ml-4 -mt-4 grid h-8 w-8 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        {!active && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-white/60 motion-safe:animate-ping"
          />
        )}
        <span
          ref={coreRef}
          className={`relative grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-lg ring-1 ring-black/5 backdrop-blur transition-opacity duration-300 ${
            dimmed ? "opacity-50" : "opacity-100"
          }`}
          style={{ color: INK }}
        >
          <svg
            ref={iconRef}
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5"
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

      <div
        ref={cardRef}
        id={`look-${spot.id}`}
        role="group"
        aria-label={spot.name}
        style={{ transformOrigin: origin, color: INK }}
        className={`invisible absolute w-[280px] rounded-2xl bg-white/95 p-3 opacity-0 shadow-[0_30px_70px_-24px_rgba(20,26,24,0.55)] ring-1 ring-black/5 backdrop-blur-md ${
          right ? "left-0 ml-6" : "right-0 mr-6"
        } ${
          below ? "top-0 -mt-4" : "bottom-0 -mb-4"
        } max-sm:fixed max-sm:inset-x-4 max-sm:bottom-4 max-sm:top-auto max-sm:m-0 max-sm:w-auto`}
      >
        <div className="flex gap-3">
          {spot.thumb && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
              <Image
                src={spot.thumb}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-serif text-[17px] leading-snug">{spot.name}</p>
            {spot.detail && (
              <p className="mt-0.5 text-[13px] opacity-60">{spot.detail}</p>
            )}
            <p className="mt-1.5 text-[15px] font-medium tabular-nums">
              {price}
            </p>
          </div>
        </div>
        <Link
          href={spot.href}
          className="mt-3 flex h-10 items-center justify-center rounded-full text-sm font-medium text-white transition-colors hover:bg-[#33403B] focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ backgroundColor: INK, outlineColor: INK }}
        >
          View product
        </Link>
      </div>
    </div>
  );
}