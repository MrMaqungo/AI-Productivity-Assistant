import { TIME_SAVED_MIN, type Feature } from "./prompts";

// Only feature name + short label + time are stored locally. No user content.
export type Activity = { feature: Feature; label: string; at: number };
const KEY = "ntethe-activity";

export function getActivity(): Activity[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function logActivity(feature: Feature, label: string) {
  const list = [{ feature, label, at: Date.now() }, ...getActivity()].slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function minutesSaved(list: Activity[]) {
  return list.reduce((n, a) => n + TIME_SAVED_MIN[a.feature], 0);
}
