"use client";

import { useRef, useCallback, useEffect } from "react";

export default function InfiniteCarousel({ items, activeIndex, onHoverItem }) {
  const rowRef = useRef(null);
  const velocityRef = useRef(0);
  const targetVelocityRef = useRef(0);
  const rafRef = useRef(null);
  const containerRef = useRef(null);

  const MAX_SPEED = 8;
  const DEADZONE = 0.1;
  const LERP_FACTOR = 0.06;

  // Repeat items 3x for seamless infinite scroll
  const repeatedItems = [...items, ...items, ...items];

  // Animation loop
  const animate = useCallback(() => {
    velocityRef.current +=
      (targetVelocityRef.current - velocityRef.current) * LERP_FACTOR;

    if (Math.abs(velocityRef.current) < 0.05) {
      velocityRef.current = 0;
    }

    if (rowRef.current && velocityRef.current !== 0) {
      const row = rowRef.current;
      row.scrollLeft += velocityRef.current;

      // Infinite loop: reset scroll position at boundaries
      const oneThird = row.scrollWidth / 3;
      if (row.scrollLeft >= oneThird * 2) {
        row.scrollLeft -= oneThird;
      } else if (row.scrollLeft <= 0) {
        row.scrollLeft += oneThird;
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  // Initialize scroll position to the middle set
  useEffect(() => {
    if (!rowRef.current) return;
    rowRef.current.scrollLeft = rowRef.current.scrollWidth / 3;
  }, [items]);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const centerX = rect.width / 2;
    const halfWidth = rect.width / 2;
    const normalized = (mouseX - centerX) / halfWidth; // -1 to 1

    if (Math.abs(normalized) < DEADZONE) {
      targetVelocityRef.current = 0;
    } else {
      const sign = normalized > 0 ? 1 : -1;
      const magnitude =
        ((Math.abs(normalized) - DEADZONE) / (1 - DEADZONE)) * MAX_SPEED;
      targetVelocityRef.current = sign * magnitude;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetVelocityRef.current = 0;
  }, []);

  return (
    <div
      className="carousel"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left arrow indicator */}
      <div className="carousel__arrow carousel__arrow--left" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </div>

      <div className="carousel__row" ref={rowRef} tabIndex={-1}>
        {repeatedItems.map((item, i) => {
          const realIndex = i % items.length;
          return (
            <span
              key={i}
              className={`carousel__item${realIndex === activeIndex ? " carousel__item--active" : ""}`}
              onMouseEnter={() => onHoverItem(realIndex)}
            >
              <span className="carousel__item-text">{item.name}</span>
            </span>
          );
        })}
      </div>

      {/* Right arrow indicator */}
      <div className="carousel__arrow carousel__arrow--right" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
