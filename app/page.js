import Header from "./components/Header";
import Hero from "./components/Hero";
import PosterCollection from "./components/PosterCollection";
import BackgroundCollection from "./components/BackgroundCollection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="collection-site page">
      <Header />
      <main className="section-container">
        <Hero />
        <PosterCollection />
        <BackgroundCollection />
      </main>
      <Footer />
    </div>
  );
}
