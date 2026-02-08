import Header from "./components/Header";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="collection-site page">
      <Header />
      <main className="section-container">
        <Hero />
      </main>
    </div>
  );
}
