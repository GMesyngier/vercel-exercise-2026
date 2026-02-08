import Header from "./components/Header";
import Hero from "./components/Hero";
import PosterCollection from "./components/PosterCollection";

export default function Home() {
  return (
    <div className="collection-site page">
      <Header />
      <main className="section-container">
        <Hero />
        <PosterCollection />
      </main>
    </div>
  );
}
