import Header from "./components/Header";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="collection-site page">
      <Header />
      <main className="gallery-main">
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
