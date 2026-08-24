import { getChapter, listChapters } from "./content";

const PORT = Number(process.env.PORT ?? 4568);
const IS_PROD = process.env.NODE_ENV === "production";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".wasm": "application/wasm",
  ".zip": "application/zip",
  ".woff2": "font/woff2",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function serveStatic(pathname: string): Promise<Response | undefined> {
  const base = new URL("../client/dist/", import.meta.url).pathname;
  let requested = pathname === "/" ? "index.html" : pathname.slice(1);
  try {
    requested = decodeURIComponent(requested);
  } catch {
    return undefined;
  }
  if (requested.includes("..")) return undefined;
  const file = Bun.file(base + requested);
  if (await file.exists()) {
    const ext = requested.slice(requested.lastIndexOf("."));
    return new Response(file, {
      headers: { "content-type": MIME[ext] ?? "application/octet-stream" },
    });
  }
  const index = Bun.file(base + "index.html");
  if (await index.exists()) {
    return new Response(index, { headers: { "content-type": MIME[".html"] } });
  }
  return undefined;
}

export const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path === "/api/health") return json({ ok: true });

    if (path === "/api/chapters" && req.method === "GET") {
      return json({ chapters: listChapters() });
    }

    const chapterMatch = path.match(/^\/api\/chapters\/([\w-]+)$/);
    if (chapterMatch && req.method === "GET") {
      const chapter = getChapter(chapterMatch[1]);
      if (!chapter) return json({ error: "Chapter not found" }, 404);
      return json({ chapter });
    }

    if (!path.startsWith("/api/")) {
      const staticResponse = await serveStatic(path);
      if (staticResponse) return staticResponse;
    }

    return json({ error: "Not found" }, 404);
  },
});

console.log(
  `python-tutorial server listening on http://localhost:${server.port} (${IS_PROD ? "production" : "development"})`,
);
