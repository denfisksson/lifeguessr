import { useState, useEffect } from "react";

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function ResultScreen({ person, outcome, elapsed, onNext, onClose }) {
  const won = outcome === "won";
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoStatus, setPhotoStatus] = useState("loading");

  useEffect(() => {
    setPhotoUrl(null);
    setPhotoStatus("loading");
    const query = encodeURIComponent(person.name);
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${query}&prop=pageimages&format=json&pithumbsize=400&origin=*`
    )
      .then((r) => r.json())
      .then((data) => {
        const pages = data?.query?.pages;
        if (pages) {
          const page = Object.values(pages)[0];
          if (page?.thumbnail?.source) {
            setPhotoUrl(page.thumbnail.source);
            setPhotoStatus("loaded");
            return;
          }
        }
        setPhotoStatus("missing");
      })
      .catch(() => setPhotoStatus("missing"));
  }, [person.name]);

  return (
    <div className="result-overlay">
      <div className="result-card">
        <div className="result-deco-top">◆ ◆ ◆ ◆ ◆ ◆ ◆</div>

        <h1 className={`result-verdict ${won ? "won" : "revealed"}`}>
          {won ? "✦ CORRECT ✦" : "✦ REVEALED ✦"}
        </h1>

        <div className="result-photo-wrap">
          {photoStatus === "loading" && (
            <div className="result-photo-placeholder result-photo-shimmer" />
          )}
          {photoStatus === "loaded" && photoUrl && (
            <img
              src={photoUrl}
              alt={person.name}
              className="result-photo-img"
              onError={() => setPhotoStatus("missing")}
            />
          )}
          {photoStatus === "missing" && (
            <div className="result-photo-placeholder result-photo-missing">
              <svg className="missing-silhouette" viewBox="0 0 80 100" fill="none">
                <circle cx="40" cy="28" r="18" fill="currentColor" opacity="0.25"/>
                <path d="M5 100 Q5 58 40 58 Q75 58 75 100" fill="currentColor" opacity="0.25"/>
                <line x1="20" y1="38" x2="60" y2="38" stroke="currentColor" strokeWidth="3" opacity="0.4"/>
                <line x1="15" y1="48" x2="65" y2="48" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
                <line x1="25" y1="58" x2="55" y2="58" stroke="currentColor" strokeWidth="3" opacity="0.2"/>
              </svg>
              <span className="missing-label">NOT IN<br/>THE ARCHIVES</span>
            </div>
          )}
        </div>

        <div className="result-name-row">
          {person.flag && <span className="result-flag">{person.flag}</span>}
          <div className="result-name">{person.name}</div>
        </div>
        <div className="result-category">{person.category}</div>

        <div className="result-time">
          <span className="result-time-label">TIME</span>
          <span className="result-time-value">{formatTime(elapsed)}</span>
        </div>

        <div className="result-bio">
          <div className="bio-row">
            <span className="bio-label">BORN</span>
            <span className="bio-value">
              {person.birthDate} · {person.birthPlace}
            </span>
          </div>
          <div className="bio-divider" />
          <div className="bio-row">
            <span className="bio-label">DIED</span>
            <span className="bio-value">
              {person.deathDate} · {person.deathPlace}
            </span>
          </div>
          <div className="bio-divider" />
          <div className="bio-row">
            <span className="bio-label">NOTE</span>
            <span className="bio-value bio-hint">{person.hint}</span>
          </div>
        </div>

        <div className="result-buttons">
          <button onClick={onNext} className="btn-primary btn-result-next">
            <span className="btn-deco">✦</span>
            NEXT FIGURE
            <span className="btn-deco">✦</span>
          </button>
          <button onClick={onClose} className="btn-close-result">
            CLOSE
          </button>
        </div>

        <div className="result-deco-bottom">◆ ◆ ◆ ◆ ◆ ◆ ◆</div>

        <a
          href={`https://github.com/denfisksson/lifeguessr/issues/new?title=${encodeURIComponent(`Data error: ${person.name}`)}&labels=data-error`}
          target="_blank"
          rel="noopener noreferrer"
          className="report-error-link"
        >
          report incorrect data
        </a>
      </div>
    </div>
  );
}
