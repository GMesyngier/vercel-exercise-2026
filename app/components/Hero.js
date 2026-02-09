import Cross from "./Cross";
export default function Hero() {
  return (
    <section className="hero">
      <Cross pos="cross-start" />
      <Cross pos="cross-end" />
      <video
        className="hero__video"
        autoPlay
        muted
        loop
        playsInline
        src="header/Vercel-Piramid-Rainbow-45.mp4"
      />
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1 className="hero__tagline">Amazing just like Vercel.</h1>
        <p className="hero__description">A collection for development fans.</p>
      </div>
    </section>
  );
}
