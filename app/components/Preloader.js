"use client";

import { useState, useEffect, useCallback } from "react";
import collections from "../../data/collections.json";

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const allUrls = useCallback(() => {
    const items = [...collections.posters, ...collections.backgrounds];
    return items.map((item) => item["thumb-url"]);
  }, []);

  useEffect(() => {
    const urls = allUrls();
    const total = urls.length;
    let loaded = 0;

    const tick = () => {
      loaded++;
      setProgress(loaded / total);

      if (loaded >= total) {
        // Small delay so the bar visually reaches 100%
        setTimeout(() => {
          setDone(true);
          // Wait for fade-out animation to finish before notifying parent
          setTimeout(() => {
            onComplete();
          }, 600);
        }, 200);
      }
    };

    urls.forEach((url) => {
      const img = new window.Image();
      img.onload = tick;
      img.onerror = tick; // count errors as loaded to avoid hanging
      img.src = url;
    });
  }, [allUrls, onComplete]);

  return (
    <div className={`preloader${done ? " preloader--done" : ""}`}>
      <div className="preloader__bar-track">
        <div
          className="preloader__bar-fill"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}
