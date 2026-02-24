"use client";

import { useState, useMemo, useRef, useCallback } from "react";
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

export default function Gallery() {
  const [copied, setCopied] = useState(false);
  const allItems = useMemo(
    () => [...collections.posters, ...collections.backgrounds],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const current = allItems[activeIndex];

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
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
            {allItems.map((item, i) => (
              <img
                key={item.name}
                src={item["thumb-url"]}
                alt={item.name}
                className={i === activeIndex ? "gallery__card-img--active" : "gallery__card-img--hidden"}
              />
            ))}
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
              onClick={handleCopy}>
              {copied ? <CheckIcon /> : <CopyIcon />}
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
