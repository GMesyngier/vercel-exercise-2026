"use client";

import { useRef, useCallback, useEffect } from "react";

export default function InfiniteCarousel({ items, activeIndex, onHoverItem }) {
  const trackRef = useRef(null);
  const velocityRef = useRef(0);
  const targetVelocityRef = useRef(0);
  const rafRef = useRef(null);
  const isHoveringRef = useRef(false);

  const ROWS = 4;
  const MAX_SPEED = 8;
  const DEADZONE = 0.1;
  const LERP_FACTOR = 0.06;

  // Generate offset rows: each row is the item list shifted by a different amount
  const getRowItems = useCallback(
    (rowIndex) => {
      const offset = Math.floor((items.length / ROWS) * rowIndex);
      const shifted = [
        ...items.slice(offset),
        ...items.slice(0, offset),
      ];
      // Repeat 3x for seamless infinite scroll
      return [...shifted, ...shifted, ...shifted];
    },
    [items]
  );

  // Animation loop
  const animate = useCallback(() => {
    // Lerp velocity toward target
    velocityRef.current +=
      (targetVelocityRef.current - velocityRef.current) * LERP_FACTOR;

    // Apply tiny threshold to stop jittering
    if (Math.abs(velocityRef.current) < 0.05) {
      velocityRef.current = 0;
    }

    if (trackRef.current && velocityRef.current !== 0) {
      const rows = trackRef.current.querySelectorAll(".carousel__row");
      rows.forEach((row, i) => {
        // Alternate row directions for visual depth
        const direction = i % 2 === 0 ? 1 : -1;
        row.scrollLeft += velocityRef.current * direction;

        // Infinite loop: reset scroll position when hitting boundaries
        const oneThird = row.scrollWidth / 3;
        if (row.scrollLeft >= oneThird * 2) {
          row.scrollLeft -= oneThird;
        } else if (row.scrollLeft <= 0) {
          row.scrollLeft += oneThird;
        }
      });
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  // Initialize scroll positions to the middle set
  useEffect(() => {
    if (!trackRef.current) return;
    const rows = trackRef.current.querySelectorAll(".carousel__row");
    rows.forEach((row) => {
      row.scrollLeft = row.scrollWidth / 3;
    });
  }, [items]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const centerX = rect.width / 2;
      const halfWidth = rect.width / 2;
      const normalized = (mouseX - centerX) / halfWidth; // -1 to 1

      // Apply deadzone
      if (Math.abs(normalized) < DEADZONE) {
        targetVelocityRef.current = 0;
      } else {
        // Map from deadzone edge to 1 → 0 to MAX_SPEED
        const sign = normalized > 0 ? 1 : -1;
        const magnitude =
          ((Math.abs(normalized) - DEADZONE) / (1 - DEADZONE)) * MAX_SPEED;
        targetVelocityRef.current = sign * magnitude;
      }
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    targetVelocityRef.current = 0;
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true;
  }, []);

  return (
    <div
      className="carousel"
      ref={trackRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Left arrow indicator */}
      <div className="carousel__arrow carousel__arrow--left" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </div>

      <div className="carousel__belt">
        {Array.from({ length: ROWS }).map((_, rowIndex) => (
          <div key={rowIndex} className="carousel__row" tabIndex={-1}>
            {getRowItems(rowIndex).map((item, i) => {
              const realIndex = i % items.length;
              return (
                <span
                  key={`${rowIndex}-${i}`}
                  className={`carousel__item${realIndex === activeIndex ? " carousel__item--active" : ""}`}
                  onMouseEnter={() => onHoverItem(realIndex)}
                >
                  {item.name}
                </span>
              );
            })}
          </div>
        ))}
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
