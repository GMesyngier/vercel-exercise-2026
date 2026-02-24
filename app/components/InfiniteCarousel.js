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
  const isTouchDeviceRef = useRef(false);

  // Detect touch device on first touch
  useEffect(() => {
    const markTouch = () => { isTouchDeviceRef.current = true; };
    window.addEventListener("touchstart", markTouch, { once: true, passive: true });
    return () => window.removeEventListener("touchstart", markTouch);
  }, []);

  const MAX_SPEED = 8;
  const DEADZONE = 0.1;
  const LERP_FACTOR = 0.06;
  const setsRef = useRef(5);

  // Compute how many sets we need to safely fill the widest viewport (3000px)
  // We need at least: ceil(viewportWidth / singleSetWidth) * 2 + 3 (buffer on both sides + center)
  const computeSets = useCallback(() => {
    if (!trackRef.current || items.length === 0) return 5;

    // Measure one item to estimate single set width
    const firstItem = trackRef.current.querySelector(".carousel__item");
    if (!firstItem) return 5;
    const itemWidth = firstItem.getBoundingClientRect().width;
    const estimatedSetWidth = itemWidth * items.length;
    const viewportWidth = window.innerWidth;

    if (estimatedSetWidth <= 0) return 5;

    // Need enough sets so that from the center, both sides are fully covered
    const setsNeeded = Math.ceil(viewportWidth / estimatedSetWidth) * 2 + 3;
    return Math.max(setsNeeded, 5);
  }, [items]);

  const [sets, setSets] = useState(5);
  const repeatedItems = Array.from({ length: sets }, () => items).flat();

  // Measure the width of one set of items
  const measureSetWidth = useCallback(() => {
    if (!trackRef.current || sets === 0) return;
    singleSetWidthRef.current = trackRef.current.scrollWidth / sets;
  }, [sets]);

  // Wrap helper: keeps offset in the middle range so both sides have content
  const wrapOffset = useCallback(() => {
    const setW = singleSetWidthRef.current;
    const s = setsRef.current;
    if (setW <= 0 || s < 5) return;

    // Keep offset in [setW * floor(s/2-1), setW * floor(s/2+1))
    const lo = setW * Math.floor(s / 2 - 1);
    const hi = setW * Math.floor(s / 2 + 1);

    while (offsetRef.current >= hi) offsetRef.current -= setW;
    while (offsetRef.current < lo) offsetRef.current += setW;
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
    }

    wrapOffset();

    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-offsetRef.current}px)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [wrapOffset]);

  // Start animation loop
  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  // Recompute sets count on resize
  useEffect(() => {
    const handleResize = () => {
      const needed = computeSets();
      setSets((prev) => (needed !== prev ? needed : prev));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [computeSets]);

  // Measure on mount, on resize, and when fonts finish loading
  useEffect(() => {
    setsRef.current = sets;

    const doMeasure = () => {
      const oldSetW = singleSetWidthRef.current;
      measureSetWidth();
      const newSetW = singleSetWidthRef.current;
      if (oldSetW > 0 && newSetW > 0 && oldSetW !== newSetW) {
        offsetRef.current = (offsetRef.current / oldSetW) * newSetW;
      }
      wrapOffset();
    };

    // Initial measure after layout settles — start in the middle of the track
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        measureSetWidth();
        offsetRef.current = singleSetWidthRef.current * Math.floor(sets / 2);
      });
    });

    document.fonts.ready.then(doMeasure);

    let ro;
    if (trackRef.current) {
      ro = new ResizeObserver(doMeasure);
      ro.observe(trackRef.current);
    }

    return () => {
      if (ro) ro.disconnect();
    };
  }, [items, sets, measureSetWidth, wrapOffset]);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || isTouchDeviceRef.current) return;
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
  const touchDistanceRef = useRef(0);
  const TAP_THRESHOLD = 10; // px — if finger moved less than this, it's a tap

  const handleTouchStart = useCallback((e) => {
    isTouchingRef.current = true;
    touchStartXRef.current = e.touches[0].clientX;
    touchPrevXRef.current = e.touches[0].clientX;
    touchDistanceRef.current = 0;
    // Kill any existing inertia
    targetVelocityRef.current = 0;
    velocityRef.current = 0;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isTouchingRef.current) return;
    const currentX = e.touches[0].clientX;
    const delta = touchPrevXRef.current - currentX;
    touchPrevXRef.current = currentX;
    touchDistanceRef.current += Math.abs(delta);

    // Apply delta directly to offset for responsive dragging
    offsetRef.current += delta;
    wrapOffset();

    // Store velocity for inertia on release
    velocityRef.current = delta;
  }, [wrapOffset]);

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
      if (isTouchDeviceRef.current) return;
      setHoveredIndex(realIndex);
      onHoverItem(realIndex);
    },
    [onHoverItem]
  );

  const handleItemLeave = useCallback(() => {
    if (isTouchDeviceRef.current) return;
    setHoveredIndex(-1);
  }, []);

  // Tap handler for mobile: select item only if the finger didn't swipe
  const handleItemClick = useCallback(
    (realIndex) => {
      if (!isTouchDeviceRef.current) return; // desktop uses hover, not click
      if (touchDistanceRef.current > TAP_THRESHOLD) return; // was a swipe, not a tap
      setHoveredIndex(realIndex);
      onHoverItem(realIndex);
    },
    [onHoverItem]
  );

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
                onClick={() => handleItemClick(realIndex)}
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
