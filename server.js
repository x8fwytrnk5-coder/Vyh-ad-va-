import express from "express";
import cors from "cors";

import {
  searchWikipedia,
  searchOpenStreetMap,
  searchWikidata,
  searchSlovakOpenData
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

  const wiki = await searchWikipedia(q);
  const osm = await searchOpenStreetMap(q);
  const wikidata = await searchWikidata(q);
  const slovak = await searchSlovakOpenData(q);

  res.json({
    query: q,
    results: [...wiki, ...osm, ...wikidata, ...slovak]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server beží na porte " + PORT);
});
