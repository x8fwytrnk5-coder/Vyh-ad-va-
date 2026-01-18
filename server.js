import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

// -----------------------------
// Wikipedia modul (priamo tu)
// -----------------------------
async function searchWikipedia(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.query.search.map(item => ({
      source: "Wikipedia",
      title: item.title,
      snippet: item.snippet.replace(/<\/?[^>]+(>|$)/g, ""),
      url: `https://en.wikipedia.org/?curid=${item.pageid}`
    }));
  } catch (err) {
    return [{ source: "Wikipedia", error: "Chyba pri načítaní dát" }];
  }
}

// -----------------------------
// Test endpoint
// -----------------------------
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Backend beží" });
});

// -----------------------------
// Hlavný SEARCH endpoint
// -----------------------------
app.get("/search", async (req, res) => {
  const q = req.query.q || "";

  if (!q) {
    return res.json({ error: "Missing query parameter ?q=" });
  }

  const wikiResults = await searchWikipedia(q);

  res.json({
    query: q,
    results: wikiResults
  });
});

// -----------------------------
// Štart servera
// -----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server beží na porte " + PORT);
});
