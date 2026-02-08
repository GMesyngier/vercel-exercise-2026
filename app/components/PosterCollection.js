import PosterCard from "./PosterCard";
import collections from "../../data/collections.json";

export default function PosterCollection() {
  return (
    <section className="section collection">
      <div className="collection__header">
        <div className="collection__header-cell" />
        <div className="collection__header-cell">
          <p className="collection__header-text">
            And we&apos;re sure you&apos;ll need some for digitals.
          </p>
        </div>
        <div className="collection__header-cell" />
      </div>

      <div className="collection__grid">
        {collections.posters.map((poster) => (
          <div key={poster.name} className="collection__item">
            <PosterCard
              title={poster.name}
              category={poster.category}
              image={poster["thumb-url"]}
              downloadUrl={poster["download-url"]}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
