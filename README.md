# Lifeguessr

A browser game where you identify historical figures from their birth and death dates and locations. A world map shows two pins — one for where the person was born, one for where they died — along with the years. Your job is to name them.

## How it works

Each round presents a pair of map markers with dates and place names as your only clues. You type a guess and submit it. Spelling does not need to be exact — the game uses fuzzy matching so minor typos are forgiven. If you get stuck, you can reveal the person's profession or a short hint, skip the figure entirely, or give up and see the answer.

The game currently includes around 200 figures spanning ancient history to the late twentieth century, drawn from politics, science, the arts, sport, and literature.

## Stack

Built with React and Vite. Maps rendered with react-simple-maps and d3-geo. No backend or database — runs entirely in the browser as a static site.

## Running locally

```
npm install
npm run dev
```

## License

MIT
