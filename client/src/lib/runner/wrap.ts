export interface InlineCheck {
  name: string;
  expr: string;
}

export function normalizeOutput(output: string): string {
  return output
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .join("\n")
    .replace(/\n+$/, "")
    .trimStart();
}

export function trimBlankLines(output: string): string {
  return output.replace(/^\n+/, "").replace(/\n+$/, "");
}
