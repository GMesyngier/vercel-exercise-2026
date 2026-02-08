import Image from "next/image";

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
    </svg>
  );
}

export default function PosterCard({ title, category, image, downloadUrl, landscape, priority = false }) {
  return (
    <article className="poster-card">
      <div className={`poster-card__thumbnail${landscape ? " poster-card__thumbnail--landscape" : ""}`}>
        <Image
          src={image}
          alt={title}
          width={360}
          height={landscape ? 270 : 480}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div className="poster-card__footer">
        <div className="poster-card__info">
          <h3 className="poster-card__title">{title}</h3>
          <span className="poster-card__category">{category}</span>
        </div>
        <div className="poster-card__actions">
          <a href={downloadUrl} download className="icon-btn" aria-label={`Download ${title}`}>
            <DownloadIcon />
          </a>
          <button className="icon-btn" aria-label={`Share ${title}`}>
            <ShareIcon />
          </button>
        </div>
      </div>
    </article>
  );
}
