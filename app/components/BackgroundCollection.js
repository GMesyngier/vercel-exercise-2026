import PosterCard from "./PosterCard";
import collections from "../../data/collections.json";
import Cross from "./Cross";

export default function BackgroundCollection() {
  return (
    <section className="section collection">
      <div className="collection__header">
        <div className="collection__header-cell" />
        <div className="collection__header-cell">
          <p className="collection__header-text">
            For sure you&apos;ll need some&nbsp; <span className="text-highlighted">for digitals</span> .
          </p>
        </div>
        <div className="collection__header-cell" />
      </div>

      <div className="collection__grid">
        {collections.backgrounds.map((bg) => (
          <div key={bg.name} className="collection__item">
            <PosterCard
              title={bg.name}
              category={bg.category}
              image={bg["thumb-url"]}
              downloadUrl={bg["download-url"]}
              landscape
            />
          </div>
        ))}

        <Cross pos="cross-start" />
        <Cross pos="cross-end" />
      </div>
    </section>
  );
}
