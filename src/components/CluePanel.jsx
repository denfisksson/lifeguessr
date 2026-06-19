export default function CluePanel({ person, hintLevel, onHint }) {
  return (
    <div className="clue-panel">
      <div className="clue-panel-header">
        <div className="deco-line" />
        <h2 className="clue-title">CLUES</h2>
        <div className="deco-line" />
      </div>

      <div className="clues-grid">
        <div className="clue-card birth-card">
          <div className="clue-card-type">✦ BIRTH</div>
          <div className="clue-row">
            <span className="clue-label">DATE</span>
            <span className="clue-value">{person.birthDate}</span>
          </div>
          <div className="clue-divider" />
          <div className="clue-row">
            <span className="clue-label">PLACE</span>
            <span className="clue-value">{person.birthPlace}</span>
          </div>
        </div>

        <div className="clue-separator">
          <div className="sep-line" />
          <div className="sep-diamond">◆</div>
          <div className="sep-line" />
        </div>

        <div className="clue-card death-card">
          <div className="clue-card-type">✦ DEATH</div>
          <div className="clue-row">
            <span className="clue-label">DATE</span>
            <span className="clue-value">{person.deathDate}</span>
          </div>
          <div className="clue-divider" />
          <div className="clue-row">
            <span className="clue-label">PLACE</span>
            <span className="clue-value">{person.deathPlace}</span>
          </div>
        </div>
      </div>

      {hintLevel < 2 && (
        <div className="hint-reveal-row">
          <button onClick={onHint} className="btn-secondary hint-reveal-btn">
            {hintLevel === 0 ? "◈ REVEAL PROFESSION ◈" : "◈ REVEAL HINT ◈"}
          </button>
        </div>
      )}

      {hintLevel >= 1 && (
        <div className="hint-box hint-category">
          <span className="hint-label">◈ PROFESSION ◈</span>
          <span className="hint-text">{person.category}</span>
        </div>
      )}

      {hintLevel >= 2 && (
        <div className="hint-box hint-clue">
          <span className="hint-label">◈ HINT ◈</span>
          <span className="hint-text">{person.hint}</span>
        </div>
      )}
    </div>
  );
}
