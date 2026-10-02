"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";

const menuItems = [
  { name: "Brands", href: "#brands" },
  { name: "Collection", href: "#collection" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const Navbar = () => {
  const navRef = useRef<HTMLElement | null>(null);
  const lastScrollY = useRef(0);

  const [menuOpen, setMenuOpen] = useState(false);

  // Navbar show / hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!navRef.current) return;

      // Show navbar when at the very top
      if (currentScrollY <= 20) {
        gsap.to(navRef.current, {
          y: 0,
          duration: 0.45,
          ease: "power3.out",
        });

        lastScrollY.current = currentScrollY;
        return;
      }

      // Scroll down → hide
      if (currentScrollY > lastScrollY.current) {
        gsap.to(navRef.current, {
          y: "-100%",
          duration: 0.5,
          ease: "power3.inOut",
        });

        // Close mobile menu if user scrolls
        setMenuOpen(false);
      }

      // Scroll up → show
      if (currentScrollY < lastScrollY.current) {
        gsap.to(navRef.current, {
          y: 0,
          duration: 0.5,
          ease: "power3.inOut",
        });
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleMenuClick = () => {
    setMenuOpen(false);

    // Make sure navbar is visible after clicking
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: 0,
        duration: 0.4,
        ease: "power3.out",
      });
    }
  };

  return (
    <>
      <header
        ref={navRef}
        className="fixed left-0 top-0 z-50 w-full bg-[#f8f8f5]/90 border-b border-black/[0.08] backdrop-blur-xl px-5 sm:px-8 md:px-12 lg:px-[9.5vw]"
      >
        <nav className="mx-auto flex h-[72px] w-full max-w-[1600px] items-center justify-between  sm:h-[76px]  md:h-[80px] ">
          {/* ================= Logo ================= */}
          <Link
            href="/"
            className="relative z-10 shrink-0 uppercase text-[19px] font-bold tracking-[-0.045em] text-[#171717] sm:text-[21px] md:text-[26px] font-playfair"
          >
            MSI London
          </Link>

          {/* ================= Desktop Navigation ================= */}
          <div className="hidden items-center gap-7 md:flex lg:gap-9 xl:gap-11">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group relative py-2 text-[16px] font-arial font-medium tracking-[0.02em] text-[#454545] transition-colors duration-300 hover:text-black lg:text-[17px]"
              >
                {item.name}

                <span className="absolute bottom-0 left-0 h-px w-0 bg-black transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* ================= Right Actions ================= */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center text-[#222] transition-transform duration-300 hover:scale-105 sm:h-10 sm:w-10"
            >
              <Search
                size={18}
                strokeWidth={1.5}
                className="sm:h-[22px] sm:w-[22px]"
              />
            </button>

            {/* Cart */}
            <button
              type="button"
              aria-label="Shopping bag"
              className="relative flex h-9 w-9 items-center justify-center text-[#222] transition-transform duration-300 hover:scale-105 sm:h-10 sm:w-10"
            >
              <ShoppingBag
                size={18}
                strokeWidth={1.5}
                className="sm:h-[22px] sm:w-[22px]"
              />

              <span className="absolute right-0 top-0 flex h-[15px] min-w-[15px] translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-[#171717] px-1 text-[8px] font-medium leading-none text-white">
                0
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center text-[#222] md:hidden"
            >
              {menuOpen ? (
                <X size={21} strokeWidth={1.5} />
              ) : (
                <Menu size={21} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* ================= Mobile Menu ================= */}
      <div
        className={`fixed inset-0 z-40 bg-[#f8f8f5] transition-all duration-500 md:hidden ${
          menuOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      >
        <div className="flex h-full flex-col px-6 pb-8 pt-[110px] sm:px-8">
          {/* Mobile Navigation */}
          <div className="flex flex-col">
            {menuItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                onClick={handleMenuClick}
                className={`border-b border-black/[0.08] py-5 text-[30px] font-light tracking-[-0.04em] text-[#171717] transition-all duration-500 sm:text-[38px] ${
                  menuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0"
                }`}
                style={{
                  transitionDelay: menuOpen
                    ? `${index * 70}ms`
                    : "0ms",
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