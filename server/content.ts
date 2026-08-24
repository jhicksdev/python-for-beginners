import { chapters } from "../content";

import type { Chapter, ChapterSummary, Exercise } from "../shared/types";

export function listChapters(): ChapterSummary[] {
  return chapters.map((c) => ({
    slug: c.slug,
    number: c.number,
    title: c.title,
    tagline: c.tagline,
    exerciseIds: c.blocks
      .filter((b): b is Exercise => b.type === "exercise")
      .map((b) => b.id),
  }));
}

export function getChapter(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug);
}
