import express from "express";
import cors from "cors";


import {
  searchWikipedia,
  searchWikidata,
  searchOpenStreetMap,
  searchSlovakMunicipalities,
  searchSlovakCompanies,
  searchRSS
} from "./sources.js";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.json({ status: "OK" });
});

app.get("/search", async (req, res) => {
  const q = req.query.q || "";

  if (!q) {
    return res.json({ error: "Missing query parameter ?q=" });
  }

  // Volanie všetkých zdrojov paralelne
  const [
    wiki,
    wikidata,
    osm,
    obce,
    firmy,
    rss
  ] = await Promise.all([
    searchWikipedia(q),
    searchWikidata(q),
    searchOpenStreetMap(q),
    searchSlovakMunicipalities(q),
    searchSlovakCompanies(q),
    searchRSS(q)
  ]);

  res.json({
    query: q,
    results: [
      ...wiki,
      ...wikidata,
      ...osm,
      ...obce,
      ...firmy,
      ...rss
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server beží na porte " + PORT);
});
