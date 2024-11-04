export type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export interface VoiceOption {
  value: OpenAIVoice;
  label: string;
  type: 'male' | 'female' | 'neutral';
}

export const VOICE_OPTIONS: VoiceOption[] = [
  { value: 'alloy', label: 'Alloy (Neutral)', type: 'neutral' },
  { value: 'echo', label: 'Echo (Deeper, Confident)', type: 'male' },
  { value: 'fable', label: 'Fable (Warm, Engaging)', type: 'male' },
  { value: 'onyx', label: 'Onyx (Deep, Authoritative)', type: 'male' },
  { value: 'nova', label: 'Nova (Clear, Professional)', type: 'female' },
  { value: 'shimmer', label: 'Shimmer (Bright, Energetic)', type: 'female' }
] as const;

export const STYLE_OPTIONS = [
  { value: 'casual', label: 'Casual Conversation' },
  { value: 'formal', label: 'Formal Discussion' },
  { value: 'educational', label: 'Educational Content' },
  { value: 'humorous', label: 'Humorous/Entertainment' },
  { value: 'debate', label: 'Debate Format' }
] as const;
