import fetch from "node-fetch";
import xml2js from "xml2js";

// ---------------------------------------------
// 1) Wikipedia
// ---------------------------------------------
export async function searchWikipedia(query) {
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
  } catch {
    return [{ source: "Wikipedia", error: "Chyba pri načítaní dát" }];
  }
}

// ---------------------------------------------
// 2) Wikidata
// ---------------------------------------------
export async function searchWikidata(query) {
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&search=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.search.map(item => ({
      source: "Wikidata",
      label: item.label,
      description: item.description,
      url: `https://www.wikidata.org/wiki/${item.id}`
    }));
  } catch {
    return [{ source: "Wikidata", error: "Chyba pri načítaní dát" }];
  }
}

// ---------------------------------------------
// 3) OpenStreetMap (Nominatim) — FIXED
// ---------------------------------------------
export async function searchOpenStreetMap(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Vyh-ad-va/1.0 (contact: example@example.com)"
      }
    });

    const data = await response.json();

    return data.map(item => ({
      source: "OpenStreetMap",
      name: item.display_name,
      lat: item.lat,
      lon: item.lon,
      type: item.type
    }));
  } catch {
    return [{ source: "OpenStreetMap", error: "Chyba pri načítaní dát" }];
  }
}

// ---------------------------------------------
// 4) Slovenské OpenData — viac datasetov
// ---------------------------------------------

// A) Obce SR
export async function searchSlovakMunicipalities(query) {
  const url = `https://data.gov.sk/api/3/action/datastore_search?q=${encodeURIComponent(query)}&resource_id=ecb7b1a0-2f3e-4c2f-9f8a-2a1a1e3b1c5e`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.result.records.map(item => ({
      source: "ObceSR",
      obec: item.NAZOV,
      okres: item.OKRES,
      kraj: item.KRAJ,
      psc: item.PSC
    }));
  } catch {
    return [{ source: "ObceSR", error: "Chyba pri načítaní dát" }];
  }
}

// B) Firmy (IČO)
export async function searchSlovakCompanies(query) {
  const url = `https://data.gov.sk/api/3/action/package_search?q=${encodeURIComponent(query)}+ico`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.result.results.map(item => ({
      source: "FirmySR",
      title: item.title,
      notes: item.notes,
      url: item.url
    }));
  } catch {
    return [{ source: "FirmySR", error: "Chyba pri načítaní dát" }];
  }
}

// ---------------------------------------------
// 5) RSS — slovenské + zahraničné
// ---------------------------------------------
const RSS_FEEDS = [
  { name: "SME", url: "https://rss.sme.sk/rss/rss.asp" },
  { name: "Aktuality", url: "https://www.aktuality.sk/rss/" },
  { name: "DennikN", url: "https://dennikn.sk/feed/" },
  { name: "BBC", url: "http://feeds.bbci.co.uk/news/rss.xml" },
  { name: "CNN", url: "http://rss.cnn.com/rss/edition.rss" }
];

export async function searchRSS(query) {
  const parser = new xml2js.Parser({ explicitArray: false });

  const results = [];

  for (const feed of RSS_FEEDS) {
    try {
      const response = await fetch(feed.url);
      const xml = await response.text();
      const json = await parser.parseStringPromise(xml);

      const items = json.rss.channel.item || [];

      items.forEach(item => {
        if (
          item.title?.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push({
            source: `RSS-${feed.name}`,
            title: item.title,
            description: item.description,
            url: item.link
          });
        }
      });
    } catch {
      results.push({ source: `RSS-${feed.name}`, error: "Chyba pri načítaní RSS" });
    }
  }

  return results;
}
