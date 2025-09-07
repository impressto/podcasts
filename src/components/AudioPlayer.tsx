import React from 'react';
import type { PlayerState } from '../types/audio';
import './AudioPlayer.css';

interface AudioPlayerProps {
  playerState: PlayerState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
}

const formatTime = (time: number): string => {
  if (isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  playerState,
  onPlay,
  onPause,
  onStop,
  onVolumeChange,
  onSeek,
  onNext,
  onPrevious,
  canGoNext = false,
  canGoPrevious = false,
}) => {
  const { isPlaying, currentTime, duration, volume, currentTrack } = playerState;

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    onSeek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(parseFloat(e.target.value) / 100);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player">
      <div className="track-info">
        <h3 className="track-title">
          {currentTrack?.title || 'No track selected'}
        </h3>
        {currentTrack?.artist && (
          <p className="track-artist">{currentTrack.artist}</p>
        )}
      </div>

      <div className="player-controls">
        <button
          className="control-btn nav-btn"
          onClick={onPrevious}
          disabled={!currentTrack || !canGoPrevious}
          title="Previous track"
        >
          ⏮️
        </button>
        <button
          className="control-btn"
          onClick={isPlaying ? onPause : onPlay}
          disabled={!currentTrack}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button
          className="control-btn"
          onClick={onStop}
          disabled={!currentTrack}
        >
          ⏹️
        </button>
        <button
          className="control-btn nav-btn"
          onClick={onNext}
          disabled={!currentTrack || !canGoNext}
          title="Next track"
        >
          ⏭️
        </button>
      </div>

      <div className="progress-section">
        <span className="time-display">{formatTime(currentTime)}</span>
        <input
          type="range"
          className="progress-bar"
          min="0"
          max="100"
          value={progressPercentage}
          onChange={handleProgressChange}
          disabled={!currentTrack}
        />
        <span className="time-display">{formatTime(duration)}</span>
      </div>

      <div className="volume-section">
        <span className="volume-icon">🔊</span>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="100"
          value={volume * 100}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};
