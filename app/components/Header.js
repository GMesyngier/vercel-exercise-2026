"use client";

import { useState, useEffect } from "react";

function VercelLogo() {
  return (
    <svg
      height="18"
      viewBox="0 0 283 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Vercel logo"
      role="img"
      style={{ color: "currentColor" }}
    >
      <path
        d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6-3.92 10-10 10-4.12 0-7.21-2.5-8.44-6.1l-8.06 4.68C176.63 48.64 182.23 52 189.24 52c11.04 0 19-7.2 19-18V16h-8v18zm-10-18c6.08 0 10 4 10 10s-3.92 10-10 10-10-4-10-10 3.92-10 10-10zM28.64 0L0 52h16.06l12.58-23.57L41.22 52h16.06L28.64 0zm93.2 16h-8v36h8V16zm-4-16a5 5 0 100 10 5 5 0 000-10zm68.96 16h-8v36h8V16zM78.24 16h-8v36h8V34c0-6 3.92-10 10-10V16c-4.11 0-7.28 1.5-10 4.2V16z"
        fill="currentColor"
      />
    </svg>
  );
}

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
          <VercelLogo />
          <p className="site-header__legend">Go tell your friends!</p>
        </div>
        <div className="site-header__actions">
          <a href="#" className="btn-header">
            Buy Merch Now!
          </a>
        </div>
      </div>
    </header>
  );
}
