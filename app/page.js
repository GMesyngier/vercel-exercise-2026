"use client";

import { useState, useCallback } from "react";
import Header from "./components/Header";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <Preloader onComplete={handleLoadComplete} />}
      <div className={`collection-site page site-content${loaded ? " site-content--loaded" : ""}`}>
        <Header />
        <main className="gallery-main">
          <Gallery />
        </main>
        <Footer />
      </div>
    </>
  );
}
