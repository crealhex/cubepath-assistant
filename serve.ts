Bun.serve({
  port: 80,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname.startsWith("/api/")) {
      const r = await fetch("http://localhost:3001" + url.pathname + url.search, {
        method: req.method,
        headers: req.headers,
        body: req.method !== "GET" ? req.body : undefined,
      });
      return new Response(r.body, { headers: r.headers, status: r.status });
    }
    const p = "launcher-web/dist" + url.pathname;
    try {
      const f = Bun.file(p);
      if (await f.exists()) return new Response(f);
    } catch {}
    return new Response(Bun.file("launcher-web/dist/index.html"));
  },
});
