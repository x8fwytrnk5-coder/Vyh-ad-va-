import fetch from "node-fetch";

export async function searchWikipedia(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.query.search.map(item => ({
      source: "Wikipedia",
      title: item.title,
      snippet: item.snippet.replace(/<\/?[^>]+(>|$)/g, ""),
      pageId: item.pageid,
      url: `https://en.wikipedia.org/?curid=${item.pageid}`
    }));
  } catch (err) {
    return [{ source: "Wikipedia", error: "Chyba pri načítaní dát" }];
  }
}
