import { readable } from "svelte/store";
import { chapters } from "../../../content/index";
import type { Chapter, ChapterSummary, Exercise } from "../../../shared/types";

export const chapterList = readable<ChapterSummary[] | null>(
  chapters.map((c) => ({
    slug: c.slug,
    number: c.number,
    title: c.title,
    tagline: c.tagline,
    exerciseIds: c.blocks
      .filter((b): b is Exercise => b.type === "exercise")
      .map((b) => b.id),
  })),
);

const chapterCache = new Map<string, Chapter>(chapters.map((c) => [c.slug, c]));

export async function loadChapter(slug: string): Promise<Chapter> {
  const chapter = chapterCache.get(slug);
  if (!chapter) throw new Error(`Chapter not found: ${slug}`);
  return chapter;
}