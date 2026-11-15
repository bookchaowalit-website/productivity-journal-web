import type { Tone } from "@/components/app-shell";

/** Mood pill colours; unknown moods fall back to grey. Text always names the mood, so colour is never the only cue. */
const TONES: Record<string, Tone> = { happy: "green", productive: "green", grateful: "green", excited: "amber", reflective: "grey", calm: "grey", frustrated: "red" };
export const moodTone = (mood: string): Tone => TONES[mood] ?? "grey";
export const label = (value: string) => (value ? value[0].toUpperCase() + value.slice(1) : value);
