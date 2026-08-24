import { beforeEach, describe, expect, test } from "bun:test";

describe("content", () => {
  let listChapters: () => ReturnType<typeof import("./content").listChapters>;
  let getChapter: (slug: string) => ReturnType<typeof import("./content").getChapter>;

  beforeEach(async () => {
    const mod = await import("./content");
    listChapters = mod.listChapters;
    getChapter = mod.getChapter;
  });

  test("lists all chapters in order", () => {
    const summaries = listChapters();
    expect(summaries.length).toBe(11);
    expect(summaries[0].slug).toBe("hello-python");
    expect(summaries[10].slug).toBe("capstone");
    for (const summary of summaries) {
      expect(Array.isArray(summary.exerciseIds)).toBe(true);
      expect(summary.title.length).toBeGreaterThan(0);
    }
  });

  test("gets a chapter by slug", () => {
    const chapter = getChapter("hello-python");
    expect(chapter?.number).toBe(1);
    expect(chapter!.blocks.length).toBeGreaterThan(3);
  });

  test("returns undefined for unknown slug", () => {
    expect(getChapter("no-such-chapter")).toBeUndefined();
  });
});

describe("api", () => {
  const PORT = 4598;

  beforeEach(() => {
    process.env.PORT = String(PORT);
  });

  test("serves the content api", async () => {
    const { server } = await import("./index");
    await new Promise((resolve) => setTimeout(resolve, 100));

    const health = await fetch(`http://localhost:${PORT}/api/health`);
    expect(await health.json()).toEqual({ ok: true });

    const chapters = await fetch(`http://localhost:${PORT}/api/chapters`);
    expect(chapters.status).toBe(200);
    const body = (await chapters.json()) as { chapters: unknown[] };
    expect(body.chapters.length).toBe(11);

    const chapter = await fetch(`http://localhost:${PORT}/api/chapters/hello-python`);
    expect(chapter.status).toBe(200);
    const chapterBody = (await chapter.json()) as { chapter: { blocks: unknown[] } };
    expect(Array.isArray(chapterBody.chapter.blocks)).toBe(true);

    const missing = await fetch(`http://localhost:${PORT}/api/chapters/nope`);
    expect(missing.status).toBe(404);

    const unknownApi = await fetch(`http://localhost:${PORT}/api/whatever`);
    expect(unknownApi.status).toBe(404);

    server.stop(true);
  }, 15000);
});
