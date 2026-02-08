export default function Hero() {
  return (
    <section className="hero">
      <video
        className="hero__video"
        autoPlay
        muted
        loop
        playsInline
        src="https://assets.vercel.com/video/upload/q_auto/contentful/image/e5382hct74si/4HOzpmSQHrGkJvOIlI24hP/43dbf26c4ebf7a5d1a8a1aa82ce70f2c/devex.mp4"
      />
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1 className="hero__tagline">Amazing just like Vercel.</h1>
        <p className="hero__description">A collection for development fans.</p>
      </div>
    </section>
  );
}
