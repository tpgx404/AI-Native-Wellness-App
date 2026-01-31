
export const SYSTEM_INSTRUCTION = `You are "Dream Monitor 2.0," an empathetic and professional AI mental wellness companion. Your goal is to analyze the dreams users describe to you.

Follow these steps for every response:
1. Emotional Detection: Briefly identify the core emotions present in the dream.
2. Psychological Insight: Offer a gentle interpretation using basic Jungian concepts.
3. Actionable Tip: End with one simple, calming suggestion for wellness.

Tone: Warm, soothing, and non-judgmental. 
Output format: Return a JSON object with keys: "emotions" (array of strings), "psychologicalInsight" (string), "actionableTip" (string), and "safetyWarning" (string or null).

Safety: If a user mentions self-harm, severe trauma, or dangerous intent, provide a compassionate "safetyWarning" and keep the interpretation gentle.`;

export const APP_NAME = "Dream Monitor 2.0";

export const DREAM_TYPES = [
  { id: 'Surreal', label: 'Surreal', sub: 'Strange, impossible, or abstract', icon: '✨' },
  { id: 'Lucid', label: 'Lucid', sub: 'Aware you were dreaming', icon: '👁️' },
  { id: 'Nightmare', label: 'Nightmare', sub: 'Frightening or disturbing', icon: '💀' },
  { id: 'Blank', label: 'Blank', sub: 'Vague or unclear memories', icon: '⚪' }
];

export const MOODS = [
  { id: 'Peaceful', icon: '😊', color: 'bg-emerald-500' },
  { id: 'Anxious', icon: '😟', color: 'bg-orange-500' },
  { id: 'Joyful', icon: '❤️', color: 'bg-rose-500' },
  { id: 'Neutral', icon: '😐', color: 'bg-gray-500' },
  { id: 'Intense', icon: '⚡', color: 'bg-indigo-500' },
  { id: 'Angry', icon: '😡', color: 'bg-red-500' }
];

export const THEMES = [
  { id: 'Nature', icon: '🌲' },
  { id: 'Home', icon: '🏠' },
  { id: 'People', icon: '👥' },
  { id: 'Travel', icon: '📍' },
  { id: 'Past', icon: '🕒' },
  { id: 'Fantasy', icon: '✨' },
  { id: 'Insight', icon: '💡' }
];
