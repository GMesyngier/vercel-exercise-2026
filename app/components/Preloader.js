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
          }, 4000);
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
      <div className="pre-animation">
        <img className="pre-tri-left" src="./preload/tri-left.svg" />
        <img className="pre-tri-right" src="./preload/tri-right.svg" />
        <div className="preloader__bar-track pre-bar-1">
          <div
            className="preloader__bar-fill"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>

        <div className="preloader__bar-track pre-bar-2">
          <div
            className="preloader__bar-fill"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>

      <img className="pre-triangle" src="./preload/triangle.svg" />
    </div>
  );
}
