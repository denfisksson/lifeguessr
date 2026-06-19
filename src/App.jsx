import { useState, useCallback, useEffect, useRef } from "react";
import { persons } from "./data/persons";
import WorldMap from "./components/WorldMap";
import CluePanel from "./components/CluePanel";
import GuessForm from "./components/GuessForm";
import ResultScreen from "./components/ResultScreen";
import RulesPage from "./components/RulesPage";
import "./App.css";

function getRandomPerson(usedIds) {
  const available = persons.filter((p) => !usedIds.has(p.id));
  if (available.length === 0) return persons[Math.floor(Math.random() * persons.length)];
  return available[Math.floor(Math.random() * available.length)];
}

function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function checkGuess(guess, name) {
  const g = normalize(guess);
  const n = normalize(name);
  if (g === n) return true;
  if (levenshtein(g, n) <= 2) return true;
  const parts = n.split(" ").filter((p) => p.length >= 4);
  return parts.some((part) => levenshtein(g, part) <= 1);
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("game");
  const [usedIds] = useState(() => new Set());
  const [person, setPerson] = useState(() => getRandomPerson(new Set()));
  const [hintLevel, setHintLevel] = useState(0);
  const [gameState, setGameState] = useState("playing");
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Reset timer when person changes (subsequent rounds)
  useEffect(() => {
    if (!gameStarted) return;
    startTimeRef.current = Date.now();
    setElapsed(0);
  }, [person.id]);

  // Tick while started and playing
  useEffect(() => {
    if (!gameStarted || gameState !== "playing") return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 500);
    return () => clearInterval(id);
  }, [gameStarted, gameState]);

  const handleStart = useCallback(() => {
    startTimeRef.current = Date.now();
    setElapsed(0);
    setGameStarted(true);
  }, []);

  const handleGuess = useCallback(
    (guess) => {
      if (gameState !== "playing") return;
      if (checkGuess(guess, person.name)) {
        const t = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setFinalTime(t);
        setGameState("won");
        setShowResult(true);
      } else {
        setWrongGuesses((prev) => [...prev, guess]);
      }
    },
    [gameState, person]
  );

  // Give up — shows result popup with answer revealed
  const handleGiveUp = useCallback(() => {
    const t = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setFinalTime(t);
    setGameState("skipped");
    setShowResult(true);
  }, []);

  // Silent skip — go straight to next figure without revealing
  const handleSkip = useCallback(() => {
    usedIds.add(person.id);
    const next = getRandomPerson(usedIds);
    setPerson(next);
    setHintLevel(0);
    setGameState("playing");
    setWrongGuesses([]);
  }, [person, usedIds]);

  const handleNext = useCallback(() => {
    usedIds.add(person.id);
    const next = getRandomPerson(usedIds);
    setPerson(next);
    setHintLevel(0);
    setGameState("playing");
    setWrongGuesses([]);
    setShowResult(false);
  }, [person, usedIds]);

  const handleClose = useCallback(() => {
    setShowResult(false);
  }, []);

  if (currentPage === "rules") {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-deco">
            <span className="deco-bar" />
            <span className="deco-motif">◆ ◈ ◆</span>
            <span className="deco-bar" />
          </div>
          <div className="header-content">
            <h1 className="app-title">
              <span className="title-line">LIFE</span>
              <span className="title-line title-accent">GUESSR</span>
            </h1>
          </div>
          <div className="header-deco">
            <span className="deco-bar" />
            <span className="deco-motif">◆ ◈ ◆</span>
            <span className="deco-bar" />
          </div>
        </header>
        <RulesPage onBack={() => setCurrentPage("game")} />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-deco">
          <span className="deco-bar" />
          <span className="deco-motif">◆ ◈ ◆</span>
          <span className="deco-bar" />
        </div>
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-line">LIFE</span>
            <span className="title-line title-accent">GUESSR</span>
          </h1>
        </div>
        <div className="header-deco">
          <span className="deco-bar" />
          <span className="deco-motif">◆ ◈ ◆</span>
          <span className="deco-bar" />
        </div>
        <nav className="header-nav">
          <button onClick={() => setCurrentPage("rules")} className="header-nav-link">
            RULES
          </button>
        </nav>
      </header>

      <main className="app-main">
        <div className="map-section">
          <WorldMap person={person} />
          {!gameStarted && (
            <div className="start-overlay">
              <div className="start-content">
                <p className="start-tagline">IDENTIFY THE HISTORICAL FIGURE</p>

                <div className="how-to-play">
                  <div className="how-to-rule">◈ A world map marks birth and death locations</div>
                  <div className="how-to-rule">◈ Dates and places are your only clues</div>
                  <div className="how-to-rule">◈ Type your guess and press SUBMIT to answer</div>
                  <div className="how-to-rule">◈ Stuck? Reveal profession or a hint for help</div>
                </div>

                <button className="btn-primary btn-start" onClick={handleStart}>
                  <span className="btn-deco">✦</span>
                  BEGIN
                  <span className="btn-deco">✦</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {gameStarted && (
          <div className="game-section">
            <CluePanel
              person={person}
              hintLevel={hintLevel}
              onHint={() => setHintLevel((l) => Math.min(l + 1, 2))}
            />

            {gameState === "playing" && (
              <GuessForm
                onGuess={handleGuess}
                onSkip={handleSkip}
                onGiveUp={handleGiveUp}
                elapsed={elapsed}
                wrongGuesses={wrongGuesses}
              />
            )}

            {gameState !== "playing" && !showResult && (
              <div className="post-round-wrap">
                <div className="post-round-time">
                  <span className="timer-label">FINAL TIME</span>
                  <span className="timer-value">{formatTime(finalTime)}</span>
                </div>
                <div className="post-round-row">
                  <button onClick={() => setShowResult(true)} className="btn-secondary">
                    ◈ VIEW RESULT ◈
                  </button>
                  <button onClick={handleNext} className="btn-primary btn-next-inline">
                    <span className="btn-deco">✦</span>
                    NEXT FIGURE
                    <span className="btn-deco">✦</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {showResult && gameStarted && (
        <ResultScreen
          person={person}
          outcome={gameState}
          elapsed={finalTime}
          onNext={handleNext}
          onClose={handleClose}
        />
      )}

      <footer className="app-footer">
        <div className="footer-deco">◆ ◈ ◆</div>
        <p className="footer-disclaimer">Historical dates and locations are approximate</p>
        <a
          href="https://github.com/denfisksson"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-credit"
        >
          <svg className="footer-github-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          Developed with love by Denfisksson
        </a>
      </footer>
    </div>
  );
}
