const KEY = "python-tutorial-progress-v1";
const LAST_KEY = "python-tutorial-last-chapter";

interface ProgressData {
  completed: Record<string, true>;
}

function load(): ProgressData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ProgressData;
      if (
        parsed &&
        typeof parsed.completed === "object" &&
        parsed.completed !== null &&
        !Array.isArray(parsed.completed)
      ) {
        return parsed;
      }
    }
  } catch {
    // corrupted storage falls back to fresh state
  }
  return { completed: {} };
}

let state = $state<ProgressData>(load());

function persist() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function getProgress(): ProgressData {
  return state;
}

export function isComplete(exerciseId: string): boolean {
  return Boolean(state.completed[exerciseId]);
}

export function markComplete(exerciseId: string) {
  if (state.completed[exerciseId]) return;
  state.completed = { ...state.completed, [exerciseId]: true };
  persist();
}

export function chapterCompletion(exerciseIds: string[]): number {
  if (exerciseIds.length === 0) return -1;
  let done = 0;
  for (const id of exerciseIds) if (state.completed[id]) done++;
  return done;
}

export function totalCompleted(): number {
  return Object.keys(state.completed).length;
}

export function resetProgress() {
  state.completed = {};
  localStorage.removeItem(LAST_KEY);
  persist();
}
