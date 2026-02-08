export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__copy">
          <span className="text-hightlighted">Vercel</span> &copy;{currentYear} all rights reserved.
        </p>
        <svg
          className="site-footer__logo"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1155 1000"
          aria-label="Vercel logo"
          role="img"
        >
          <path d="m577.3 0 577.4 1000H0z" fill="currentColor" />
        </svg>
      </div>
    </footer>
  );
}
