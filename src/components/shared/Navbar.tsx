"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/log.png";

const menuItems = [
  { name: "Brands", href: "#brands" },
  { name: "Collection", href: "#collection" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const SCROLL_DELTA = 6; // choto scroll jitter ignore korar jnno

const Navbar = () => {
  const navRef = useRef<HTMLElement | null>(null);
  const lastScrollY = useRef(0);
  const menuOpenRef = useRef(false);

  const [menuOpen, setMenuOpen] = useState(false);

  // menuOpen er latest value scroll handler e lagbe (re-bind chara)
  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  const showNav = (duration = 0.45) => {
    if (!navRef.current) return;
    gsap.to(navRef.current, {
      y: 0,
      duration,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const hideNav = () => {
    if (!navRef.current) return;
    gsap.to(navRef.current, {
      y: "-100%",
      duration: 0.5,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  };

  // Navbar show / hide on scroll
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      // Menu khola thakle navbar hide hobe na
      if (menuOpenRef.current) return;

      const currentScrollY = Math.max(window.scrollY, 0); // iOS bounce fix
      const diff = currentScrollY - lastScrollY.current;

      // Top e thakle always show
      if (currentScrollY <= 20) {
        showNav();
        lastScrollY.current = currentScrollY;
        return;
      }

      if (Math.abs(diff) < SCROLL_DELTA) return;

      if (diff > 0) hideNav(); // scroll down
      else showNav(0.5); // scroll up

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (navRef.current) gsap.killTweensOf(navRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mobile menu open thakle body scroll lock
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    if (menuOpen) showNav(0.3);

    return () => {
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  // Desktop size e gele menu auto close + Esc diye close
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    mq.addEventListener("change", handleChange);
    window.addEventListener("keydown", handleKey);

    return () => {
      mq.removeEventListener("change", handleChange);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleMenuClick = () => {
    setMenuOpen(false);
    showNav(0.4);
  };

  return (
    <>
      <header
        ref={navRef}
        className="fixed left-0 top-0 z-50 w-full border-b border-black/[0.08] bg-[#f8f8f5]/90 px-4 backdrop-blur-xl min-[400px]:px-5 sm:px-8 md:px-10 lg:px-[6vw] xl:px-[9.5vw]"
      >
        <nav className="mx-auto flex h-[60px] w-full max-w-[1600px] items-center justify-between gap-3 min-[400px]:h-[66px] sm:h-[72px] md:h-[78px] lg:h-[80px]">
          {/* ================= Logo ================= */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="relative z-10 flex min-w-0 shrink-0 items-center gap-1.5 whitespace-nowrap font-playfair text-[15px] font-bold uppercase tracking-[-0.045em] text-[#171717] min-[400px]:gap-2 min-[400px]:text-[17px] sm:text-[20px] md:text-[22px] lg:text-[26px]"
          >
            <Image
              src={logo}
              alt="MSI London"
              width={100}
              height={100}
              priority
              className="h-[22px] w-auto object-contain min-[400px]:h-[26px] sm:h-[30px] md:h-[32px]"
            />
            London
          </Link>

          {/* ================= Desktop Navigation ================= */}
          <div className="hidden items-center gap-5 md:flex lg:gap-9 xl:gap-11">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group relative py-2 font-arial text-[14px] font-medium tracking-[0.02em] text-[#454545] transition-colors duration-300 hover:text-black lg:text-[16px] xl:text-[17px]"
              >
                {item.name}

                <span className="absolute bottom-0 left-0 h-px w-0 bg-black transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* ================= Right Actions ================= */}
          <div className="flex shrink-0 items-center gap-0.5 min-[400px]:gap-1.5 sm:gap-3 md:gap-4">
            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center text-[#222] transition-transform duration-300 hover:scale-105 sm:h-11 sm:w-11"
            >
              <Search
                strokeWidth={1.5}
                className="h-[18px] w-[18px] sm:h-5 sm:w-5 lg:h-[22px] lg:w-[22px]"
              />
            </button>

            {/* Cart */}
            <button
              type="button"
              aria-label="Shopping bag"
              className="relative flex h-10 w-10 items-center justify-center text-[#222] transition-transform duration-300 hover:scale-105 sm:h-11 sm:w-11"
            >
              <ShoppingBag
                strokeWidth={1.5}
                className="h-[18px] w-[18px] sm:h-5 sm:w-5 lg:h-[22px] lg:w-[22px]"
              />

              <span className="absolute right-1 top-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#171717] px-1 text-[8px] font-medium leading-none text-white sm:right-1.5 sm:top-2">
                0
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center text-[#222] sm:h-11 sm:w-11 md:hidden"
            >
              {menuOpen ? (
                <X className="h-[21px] w-[21px] sm:h-6 sm:w-6" strokeWidth={1.5} />
              ) : (
                <Menu className="h-[21px] w-[21px] sm:h-6 sm:w-6" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* ================= Mobile Menu ================= */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-[#f8f8f5] transition-all duration-500 md:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex min-h-[100dvh] flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[84px] min-[400px]:px-6 min-[400px]:pt-[92px] sm:px-8 sm:pt-[100px]">
          {/* Mobile Navigation */}
          <div className="flex flex-col">
            {menuItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                onClick={handleMenuClick}
                className={`border-b border-black/[0.08] py-4 text-[clamp(26px,8vw,40px)] font-light tracking-[-0.04em] text-[#171717] transition-all duration-500 landscape:py-2.5 landscape:text-[24px] sm:py-5 ${
                  menuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0"
                }`}
                style={{
                  transitionDelay: menuOpen ? `${index * 70}ms` : "0ms",
                }}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Bottom */}
          <div className="mt-auto flex items-end justify-between border-t border-black/[0.08] pt-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                London
              </p>

              <p className="mt-1 text-[12px] text-black/60">
                Contemporary design
              </p>
            </div>

            <p className="text-[11px] text-black/40">
              © {new Date().getFullYear()} MSI
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;