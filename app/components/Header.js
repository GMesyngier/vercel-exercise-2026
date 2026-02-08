"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__logo">
          <Image
            src="/vercel.svg"
            alt="Vercel logo"
            width={22}
            height={19}
            style={{ width: "auto", height: "auto" }}
          />
          <span className="site-header__wordmark">Vercel</span>
        </div>
        <div className="site-header__actions">
          <a href="#" className="btn-header">
            Sign Up
          </a>
        </div>
      </div>
    </header>
  );
}
