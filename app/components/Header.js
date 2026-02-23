function VercelLogo() {
  return (
    <img src="public/header/vercel-logo.svg" />
  );
}

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__logo">
          <VercelLogo />
        </div>
        <p className="site-header__tagline">A collection for development fans.</p>
        <div className="site-header__actions">
          <a href="#" className="btn-header">
            Buy Our Merch Now!
          </a>
        </div>
      </div>
    </header>
  );
}
