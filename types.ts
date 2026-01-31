
export type DreamType = 'Surreal' | 'Lucid' | 'Nightmare' | 'Blank';
export type Mood = 'Peaceful' | 'Anxious' | 'Joyful' | 'Neutral' | 'Intense' | 'Angry';
export type Theme = 'Nature' | 'Home' | 'People' | 'Travel' | 'Past' | 'Fantasy' | 'Insight';
export type InputMode = 'Sketch' | 'Speak' | 'Type';

export interface DreamAnalysis {
  emotions: string[];
  psychologicalInsight: string;
  actionableTip: string;
  safetyWarning?: string;
}

export interface DreamRecord {
  id: string;
  timestamp: number;
  description: string;
  sketchData?: string; // Base64 or path
  analysis: DreamAnalysis | null;
  type: DreamType;
  mood: Mood;
  themes: Theme[];
  clarity: number;
  intensity: number;
  inputMode: InputMode;
}

export interface DreamState {
  records: DreamRecord[];
  currentView: 'home' | 'dashboard';
  isTagging: boolean;
  isStatusOpen: boolean;
  loading: boolean;
  error: string | null;
}
