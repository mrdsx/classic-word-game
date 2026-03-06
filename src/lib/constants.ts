export const FRONTEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://classic-word-game.vercel.app";
