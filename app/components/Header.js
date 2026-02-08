"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__logo">
          <Image
            src="header/vercel-logo.svg"
            alt="Vercel logo"
            width={91}
            height={18}
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
