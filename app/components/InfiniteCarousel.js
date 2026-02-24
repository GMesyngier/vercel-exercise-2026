"use client";

import { useRef, useCallback, useEffect, useState } from "react";

export default function InfiniteCarousel({ items, onHoverItem }) {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const targetVelocityRef = useRef(0);
  const rafRef = useRef(null);
  const singleSetWidthRef = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const MAX_SPEED = 8;
  const DEADZONE = 0.1;
  const LERP_FACTOR = 0.06;

  // Repeat items 3x for seamless infinite scroll
  const repeatedItems = [...items, ...items, ...items];

  // Measure the width of one set of items
  const measureSetWidth = useCallback(() => {
    if (!trackRef.current) return;
    // Total width divided by 3 sets
    singleSetWidthRef.current = trackRef.current.scrollWidth / 3;
  }, []);

  // Animation loop using translateX instead of scrollLeft
  const animate = useCallback(() => {
    velocityRef.current +=
      (targetVelocityRef.current - velocityRef.current) * LERP_FACTOR;

    if (Math.abs(velocityRef.current) < 0.05) {
      velocityRef.current = 0;
    }

    if (velocityRef.current !== 0) {
      offsetRef.current += velocityRef.current;
      const setW = singleSetWidthRef.current;

      if (setW > 0) {
        // Wrap the offset within one set width (modular arithmetic)
        // This guarantees no jump regardless of screen size or speed
        offsetRef.current = ((offsetRef.current % setW) + setW) % setW;
      }
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-offsetRef.current}px)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  // Start animation loop
  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  // Measure on mount, on resize, and when fonts finish loading
  useEffect(() => {
    const doMeasure = () => {
      const oldSetW = singleSetWidthRef.current;
      measureSetWidth();
      // Adjust offset proportionally so the visual position doesn't jump
      if (oldSetW > 0 && singleSetWidthRef.current > 0 && oldSetW !== singleSetWidthRef.current) {
        const ratio = offsetRef.current / oldSetW;
        offsetRef.current = ratio * singleSetWidthRef.current;
      }
    };

    // Initial measure after layout settles
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        measureSetWidth();
        offsetRef.current = singleSetWidthRef.current;
      });
    });

    // Re-measure when fonts finish loading (padding/text size may change)
    document.fonts.ready.then(doMeasure);

    // ResizeObserver on the track to catch any layout shift
    let ro;
    if (trackRef.current) {
      ro = new ResizeObserver(doMeasure);
      ro.observe(trackRef.current);
    }

    window.addEventListener("resize", doMeasure);
    return () => {
      window.removeEventListener("resize", doMeasure);
      if (ro) ro.disconnect();
    };
  }, [items, measureSetWidth]);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const centerX = rect.width / 2;
    const halfWidth = rect.width / 2;
    const normalized = (mouseX - centerX) / halfWidth;

    if (Math.abs(normalized) < DEADZONE) {
      targetVelocityRef.current = 0;
    } else {
      const sign = normalized > 0 ? 1 : -1;
      const magnitude =
        ((Math.abs(normalized) - DEADZONE) / (1 - DEADZONE)) * MAX_SPEED;
      targetVelocityRef.current = sign * magnitude;
    }
  }, []);

  // --- Touch / swipe support for mobile ---
  const touchStartXRef = useRef(0);
  const touchPrevXRef = useRef(0);
  const isTouchingRef = useRef(false);

  const handleTouchStart = useCallback((e) => {
    isTouchingRef.current = true;
    touchStartXRef.current = e.touches[0].clientX;
    touchPrevXRef.current = e.touches[0].clientX;
    // Kill any existing inertia
    targetVelocityRef.current = 0;
    velocityRef.current = 0;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isTouchingRef.current) return;
    const currentX = e.touches[0].clientX;
    const delta = touchPrevXRef.current - currentX;
    touchPrevXRef.current = currentX;

    // Apply delta directly to offset for responsive dragging
    offsetRef.current += delta;
    const setW = singleSetWidthRef.current;
    if (setW > 0) {
      offsetRef.current = ((offsetRef.current % setW) + setW) % setW;
    }

    // Store velocity for inertia on release
    velocityRef.current = delta;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isTouchingRef.current = false;
    // Let the existing animation loop handle inertia decay
    // velocityRef already has the last delta, targetVelocity stays 0
    // so it will naturally decelerate via the lerp
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetVelocityRef.current = 0;
    setHoveredIndex(-1);
  }, []);

  const handleItemEnter = useCallback(
    (realIndex) => {
      setHoveredIndex(realIndex);
      onHoverItem(realIndex);
    },
    [onHoverItem]
  );

  const handleItemLeave = useCallback(() => {
    setHoveredIndex(-1);
  }, []);

  return (
    <div
      className="carousel"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Left arrow indicator */}
      <div className="carousel__arrow carousel__arrow--left" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </div>

      <div className="carousel__track">
        <div className="carousel__row" ref={trackRef}>
          {repeatedItems.map((item, i) => {
            const realIndex = i % items.length;
            const isHovered = realIndex === hoveredIndex;
            return (
              <span
                key={i}
                className={`carousel__item${isHovered ? " carousel__item--active" : ""}`}
                onMouseEnter={() => handleItemEnter(realIndex)}
                onMouseLeave={handleItemLeave}
              >
                <span className="carousel__item-text">{item.name}</span>
              </span>
            );
          })}
        </div>
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
