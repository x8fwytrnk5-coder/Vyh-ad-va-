export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/search") {
      return new Response("Not found", { status: 404 });
    }

    const q = url.searchParams.get("q");
    const lang = url.searchParams.get("lang") || "sk-SK";

    if (!q) {
      return new Response(JSON.stringify({ error: "Missing q" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiUrl =
      "https://api.bing.microsoft.com/v7.0/search?q=" +
      encodeURIComponent(q) +
      "&mkt=" +
      encodeURIComponent(lang);

    const apiResp = await fetch(apiUrl, {
      headers: {
        "Ocp-Apim-Subscription-Key": env.BING_KEY,
      },
    });

    if (!apiResp.ok) {
      return new Response(
        JSON.stringify({ error: "Upstream error", status: apiResp.status }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await apiResp.json();
    const webPages = (data.webPages && data.webPages.value) || [];

    const results = webPages.map((item) => ({
      title: item.name,
      url: item.url,
      snippet: item.snippet || item.description || "",
      source: item.displayUrl || "",
      date: item.dateLastCrawled || "",
      language: lang,
      region: "world",
    }));

    return new Response(JSON.stringify({ results }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
