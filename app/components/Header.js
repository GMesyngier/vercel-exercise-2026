"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " site-header--scrolled" : ""}`}>
      <div className="site-header__inner">
        <div className="site-header__logo">
          <Image
            src="header/vercel-logo.svg"
            alt="Vercel logo"
            width={91}
            height={18}
            priority
            style={{ width: "auto", height: "auto" }}
          />
          <p className="site-header__legend">Go tell your friends!</p>
        </div>
        <div className="site-header__actions">
          <a href="#" className="btn-header">
            Buy Our Merch Now!
          </a>
        </div>
      </div>
    </header>
  );
}
