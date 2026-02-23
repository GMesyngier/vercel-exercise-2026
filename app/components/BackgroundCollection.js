import PosterCard from "./PosterCard";
import collections from "../../data/collections.json";

export default function BackgroundCollection() {
  return (
    <section className="section collection">
      <div className="collection__header">
        <p className="collection__header-text">
          {"For sure you'll need some"}&nbsp;<span className="text-highlighted">for digitals</span>.
        </p>
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
      </div>
    </section>
  );
}
