export interface AudioFile {
  id: string;
  title: string;
  genre?: string;
  src: string;
  duration?: number;
  unlisted?: boolean;
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
