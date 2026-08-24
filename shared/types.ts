export interface OutputCheck {
  kind: "output";
  expect: string;
  mode?: "exact" | "contains" | "regex";
  displayExpect?: string;
}

export interface AssertionCheck {
  name: string;
  expr: string;
}

export interface AssertCheck {
  kind: "assert";
  checks: AssertionCheck[];
  failHint?: string;
}

export type ExerciseCheck = OutputCheck | AssertCheck;

export interface Exercise {
  type: "exercise";
  id: string;
  title: string;
  prompt: string;
  starter: string;
  check: ExerciseCheck;
  hint?: string;
  solution?: string;
  successMessage?: string;
  /** Learner code MUST contain a call to each of these string/object methods
   *  (e.g. "upper"). Detected via AST, so only real calls count. */
  mustUseMethods?: string[];
  /** Learner code MUST contain a call to each of these plain functions
   *  (e.g. "len"). Detected via AST, so only real calls count. */
  mustUseFunctions?: string[];
}

export interface ExampleBlock {
  type: "example";
  title?: string;
  code: string;
  note?: string;
}

export interface ProseBlock {
  type: "prose";
  md: string;
}

export type LessonBlock = ProseBlock | ExampleBlock | Exercise;

export interface Chapter {
  slug: string;
  number: number;
  title: string;
  tagline: string;
  blocks: LessonBlock[];
}

export interface ChapterSummary {
  slug: string;
  number: number;
  title: string;
  tagline: string;
  exerciseIds: string[];
}

export interface CheckResult {
  name: string;
  ok: boolean;
  got?: string;
  error?: string;
}

export interface RunResult {
  ok: boolean;
  output: string;
  error?: string;
  timedOut?: boolean;
  checks?: CheckResult[];
  /** One entry per required `mustUseMethods`/`mustUseFunctions` callable. */
  methodChecks?: CheckResult[];
}
