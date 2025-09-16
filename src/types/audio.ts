export interface AudioFile {
  id: string;
  title: string;
  artist?: string;
  src: string;
  duration?: number;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentTrack: AudioFile | null;
  isBuffering: boolean;
  isLoading: boolean;
  loadProgress: number;
  error: string | null;
}
