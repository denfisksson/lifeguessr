export default function RulesPage({ onBack }) {
  return (
    <div className="rules-page">
      <div className="rules-card">
        <div className="rules-deco-top">◆ ◈ ◆ ◈ ◆ ◈ ◆</div>

        <h2 className="rules-title">RULES & INFORMATION</h2>

        <section className="rules-section">
          <h3 className="rules-section-title">HOW TO PLAY</h3>
          <ol className="rules-list">
            <li>A world map displays two markers — one for birth, one for death</li>
            <li>The dates and locations are your only starting clues</li>
            <li>Type your guess into the input field and press SUBMIT</li>
            <li>Fuzzy matching is used — you don't need perfect spelling</li>
            <li>You may reveal the profession or an extra hint if you get stuck</li>
            <li>SKIP moves silently to the next figure. GIVE UP reveals the answer</li>
          </ol>
        </section>

        <div className="rules-divider" />

        <section className="rules-section">
          <h3 className="rules-section-title">ABOUT THE FIGURES</h3>
          <p className="rules-text">
            Lifeguessr features 196 historical figures spanning antiquity to the present day —
            scientists, rulers, artists, athletes, revolutionaries and more. Each round is drawn
            at random from the full pool until all figures have been seen.
          </p>
          <p className="rules-text rules-disclaimer">
            Historical dates and locations are approximate in some cases, particularly for
            ancient figures. If you spot an inaccuracy, please use the report link in the result popup.
          </p>
        </section>

        <div className="rules-divider" />

        <section className="rules-section rules-section--coming-soon">
          <h3 className="rules-section-title">COMING SOON</h3>
          <p className="rules-text rules-text--dim">More content will be added here.</p>
        </section>

        <div className="rules-deco-bottom">◆ ◈ ◆ ◈ ◆ ◈ ◆</div>

        <button onClick={onBack} className="btn-secondary rules-back-btn">
          ← BACK TO GAME
        </button>
      </div>
    </div>
  );
}
