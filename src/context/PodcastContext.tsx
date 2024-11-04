import React from 'react';

export type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export interface VoiceOption {
  value: OpenAIVoice;
  label: string;
  type: 'male' | 'female' | 'neutral';
}

export const VOICE_OPTIONS: VoiceOption[] = [
  { value: 'alloy', label: 'Alloy', type: 'neutral' },
  { value: 'echo', label: 'Echo', type: 'male' },
  { value: 'fable', label: 'Fable', type: 'male' },
  { value: 'onyx', label: 'Onyx', type: 'male' },
  { value: 'nova', label: 'Nova', type: 'female' },
  { value: 'shimmer', label: 'Shimmer', type: 'female' }
];

export interface PodcastConfig {
  podcastName: string;
  voice1Name: string;
  voice2Name: string;
  voice1: OpenAIVoice;
  voice2: OpenAIVoice;
  topic: string;
  additionalInfo: string;
  podcastStyle: string;
  useOnlineSearch: boolean;
}

export interface PodcastContextType {
  config: PodcastConfig | null;
  transcript: string;
  audioUrl: string;
  setPodcastConfig: (config: PodcastConfig) => void;
  setTranscript: (transcript: string) => void;
  setAudioUrl: (audioUrl: string) => void;
}

export const PodcastContext = React.createContext<PodcastContextType>({
  config: null,
  transcript: '',
  audioUrl: '',
  setPodcastConfig: () => {},
  setTranscript: () => {},
  setAudioUrl: () => {},
});