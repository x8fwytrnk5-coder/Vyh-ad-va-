import fetch from "node-fetch";

// 🔹 Wikipedia
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

// 🔹 OpenStreetMap (Nominatim)
export async function searchOpenStreetMap(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
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

// 🔹 Wikidata
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

// 🔹 Slovenské OpenData (data.gov.sk)
export async function searchSlovakOpenData(query) {
  const url = `https://data.gov.sk/api/3/action/package_search?q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.result.results.map(item => ({
      source: "SlovakOpenData",
      title: item.title,
      notes: item.notes,
      url: item.url
    }));
  } catch {
    return [{ source: "SlovakOpenData", error: "Chyba pri načítaní dát" }];
  }
}
