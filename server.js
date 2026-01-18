import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

// Test endpoint – aby Render vedel, že server beží
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Backend beží" });
});

// Hlavný endpoint pre vyhľadávanie
app.get("/search", async (req, res) => {
  const q = req.query.q || "";

  if (!q) {
    return res.json({ error: "Missing query parameter ?q=" });
  }

  // Zatiaľ len návrat testovacej odpovede
  res.json({
    query: q,
    results: [
      { source: "backend", text: `Vyhľadávam: ${q}` }
    ]
  });
});

// Render používa PORT z prostredia
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server beží na porte " + PORT);
});
