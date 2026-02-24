import Image from 'next/image';

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__logo">
          <Image
            src='header/vercel-logo.svg'
            alt="Vercel logo"
            width={91}
            height={18}
            priority
          />
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
