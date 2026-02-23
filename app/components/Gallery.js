"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import collections from "../../data/collections.json";
import InfiniteCarousel from "./InfiniteCarousel";

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.046a4.5 4.5 0 0 0-1.242-7.244l4.5-4.5a4.5 4.5 0 0 1 6.364 6.364l-1.757 1.757" />
    </svg>
  );
}

export default function Gallery() {
  const allItems = useMemo(
    () => [...collections.posters, ...collections.backgrounds],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const current = allItems[activeIndex];

  // Preload all thumbnail images natively on mount
  useEffect(() => {
    allItems.forEach((item) => {
      const img = new window.Image();
      img.src = item["thumb-url"];
    });
  }, [allItems]);

  const handleCardMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1
    const MAX_TILT = 8;
    setTilt({
      rotateX: (0.5 - y) * MAX_TILT,  // tilt toward mouse vertically
      rotateY: (x - 0.5) * MAX_TILT,  // tilt toward mouse horizontally
    });
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  const handleCopy = () => {
    const url = `${window.location.origin}${current["download-url"]}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <section className="gallery">
      {/* Featured card area */}
      <div className="gallery__card-area">
        <div
          className="gallery__card"
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          style={{
            transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          }}
        >
          <div className="gallery__card-image">
            <img
              src={current["thumb-url"]}
              alt={current.name}
            />
          </div>
        </div>

        {/* Info row below card - keyed for subtle text fade */}
        <div className="gallery__card-info" key={activeIndex}>
          <div className="gallery__card-meta">
            <h2 className="gallery__card-title">{current.name}</h2>
            <span className="gallery__card-category">{current.category}</span>
          </div>
          <div className="gallery__card-actions">
            <a
              href={current["download-url"]}
              download={current["download-url"].split("/").pop()}
              className="icon-btn"
              aria-label={`Download ${current.name}`}
            >
              <DownloadIcon />
            </a>
            <button
              className="icon-btn"
              aria-label={`Copy link for ${current.name}`}
              onClick={handleCopy}
            >
              <CopyIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Infinite carousel */}
      <InfiniteCarousel
        items={allItems}
        onHoverItem={setActiveIndex}
      />


    </section>
  );
}
