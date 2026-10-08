"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EXPLORE = [
  { label: "Brands", href: "/brands" },
  { label: "Collection", href: "/collection" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const TRADE = [
  { label: "Trade account", href: "/trade" },
  { label: "Our services", href: "/#services" },
  { label: "Delivery & installation", href: "/delivery" },
  { label: "Book a showroom visit", href: "/contact" },
];

const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group relative inline-block pb-1 text-[15px] text-[#E5E5E3]/70 outline-none transition-colors duration-300 hover:text-[#E5E5E3] focus-visible:text-[#E5E5E3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E5E5E3] motion-reduce:transition-none"
    >
      {children}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-[#E5E5E3] transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100 motion-reduce:transition-none"
      />
    </Link>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-5 text-xs tracking-[0.25em] text-[#E5E5E3]/50">
      {children}
    </h3>
  );
}

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
        const { reduce } = context.conditions as { reduce: boolean };
        if (reduce) return;

        // Columns fade up together
        gsap.from("[data-col]", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-cols]", start: "top 85%", once: true },
        });

        // Giant wordmark rises out of its clipped box
        gsap.from("[data-wordmark]", {
          yPercent: 100,
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: { trigger: "[data-wordmark-box]", start: "top 95%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <footer ref={root}  className="bg-[#141413] pt-24">
     <div className="mx-auto w-full max-w-[1500px] text-[#E5E5E3]">
       <div>
        {/* Top: statement + CTA */}
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-[600px] text-left font-serif text-4xl font-normal uppercase tracking-tight md:text-6xl">
            Let&apos;s furnish your next space
          </h2>

          <Link
            href="/contact"
            className="w-fit bg-[#E5E5E3] px-8 py-3.5 text-sm font-medium tracking-wide text-[#141413] outline-none transition-colors duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E5E5E3] motion-reduce:transition-none"
          >
            Book a showroom visit
          </Link>
        </div>

        <div className="mt-16 h-px w-full bg-[#E5E5E3]/15 md:mt-24" />

        {/* Columns */}
        <div
          data-cols
          className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12 md:gap-x-6"
        >
          <div data-col className="col-span-2 md:col-span-4">
            <ColumnTitle>SHOWROOM</ColumnTitle>
            <address className="text-[15px] not-italic leading-relaxed text-[#E5E5E3]/70">
              Showroom address line
              <br />
              Barnet, London
              <br />
              Postcode
            </address>
            <p className="mt-5 text-[15px] leading-relaxed text-[#E5E5E3]/70">
              Mon to Fri, 9:00 to 17:30
              <br />
              Saturday by appointment
            </p>
            <div className="mt-5 flex flex-col items-start">
              <FooterLink href="tel:+442000000000">+44 20 0000 0000</FooterLink>
              <FooterLink href="mailto:trade@yourdomain.com">
                trade@yourdomain.com
              </FooterLink>
            </div>
          </div>

          <div data-col className="md:col-span-2 md:col-start-6">
            <ColumnTitle>EXPLORE</ColumnTitle>
            <ul className="flex flex-col items-start gap-2">
              {EXPLORE.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div data-col className="md:col-span-2 md:col-start-8">
            <ColumnTitle>TRADE</ColumnTitle>
            <ul className="flex flex-col items-start gap-2">
              {TRADE.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div data-col className="col-span-2 md:col-span-3 md:col-start-10">
            <ColumnTitle>NEWSLETTER</ColumnTitle>
            <p className="text-[15px] leading-relaxed text-[#E5E5E3]/70">
              New arrivals and trade offers, once a month.
            </p>

            {sent ? (
              <p className="mt-6 text-[15px] text-[#E5E5E3]">Thank you, you&apos;re on the list.</p>
            ) : (
              <form
                className="mt-6 flex items-center gap-3 border-b border-[#E5E5E3]/30 pb-2 transition-colors duration-300 focus-within:border-[#E5E5E3]"
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO: send the email to your API / mailing provider
                  setSent(true);
                }}
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="Email address"
                  className="w-full bg-transparent text-[15px] text-[#E5E5E3] outline-none placeholder:text-[#E5E5E3]/40"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="text-lg text-[#E5E5E3] transition-transform duration-300 hover:translate-x-1 motion-reduce:transition-none"
                >
                  →
                </button>
              </form>
            )}

            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
              {SOCIAL.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href} external>
                    {l.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Giant wordmark */}
        <div
          data-wordmark-box
          className="mt-20 overflow-hidden border-b border-[#E5E5E3]/15 md:mt-28"
        >
          <p
            data-wordmark
            aria-hidden
            className="select-none text-center font-serif text-[240px] uppercase leading-[0.9] tracking-tight text-[#E5E5E3]"
          >
            MSI London
          </p>
        </div>

        {/* Bottom bar */}
        <div className="my-6 flex flex-col gap-4 text-xs tracking-wide text-[#E5E5E3]/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} MSI London. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors duration-300 hover:text-[#E5E5E3]">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors duration-300 hover:text-[#E5E5E3]">
              Terms
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="transition-colors duration-300 hover:text-[#E5E5E3]"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
     </div>
    </footer>
  );
}