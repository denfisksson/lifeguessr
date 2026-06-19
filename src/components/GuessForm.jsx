import { useState } from "react";

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function GuessForm({ onGuess, onSkip, onGiveUp, elapsed, wrongGuesses }) {
  const [input, setInput] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim()) {
      onGuess(input.trim());
      setInput("");
    }
  }

  return (
    <div className="guess-form-container">
      <div className="timer-row">
        <span className="timer-label">TIME ELAPSED</span>
        <span className="timer-value">{formatTime(elapsed)}</span>
      </div>

      <form onSubmit={handleSubmit} className="guess-form">
        <div className="input-wrapper">
          <span className="input-deco">◈</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Name the historical figure…"
            className="guess-input"
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
          <span className="input-deco">◈</span>
        </div>
        <button type="submit" className="btn-primary btn-submit">
          <span className="btn-deco">✦</span>
          SUBMIT GUESS
          <span className="btn-deco">✦</span>
        </button>
      </form>

      <div className="aux-buttons">
        <button onClick={onSkip} className="btn-secondary">
          ◈ SKIP ◈
        </button>
        <button onClick={onGiveUp} className="btn-give-up">
          GIVE UP
        </button>
      </div>

      {wrongGuesses.length > 0 && (
        <div className="wrong-guesses">
          <span className="wrong-label">TRIED</span>
          <div className="wrong-list">
            {wrongGuesses.map((g, i) => (
              <span key={i} className="wrong-guess">✗ {g}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
