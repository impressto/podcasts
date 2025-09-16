import React, { useState } from 'react';
import type { PlayerState } from '../types/audio';
import { QRCodeSVG } from 'qrcode.react';
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
  const [showQRCode, setShowQRCode] = useState(false);
  
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    volume, 
    currentTrack, 
    isBuffering, 
    isLoading,
    loadProgress,
    error
  } = playerState;

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    onSeek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(parseFloat(e.target.value) / 100);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Get the current URL for the QR code
  const getCurrentUrl = () => {
    if (!currentTrack) return window.location.href;
    
    // Get the base URL (remove hash if present)
    const baseUrl = window.location.href.split('#')[0];
    
    // Construct the URL with the track ID and standalone mode
    return `${baseUrl}#track=${currentTrack.id};standalone`;
  };

  return (
    <div className="audio-player">
      <div className="track-info">
        <h3 className="track-title">
          {currentTrack?.title || 'No track selected'}
          {isLoading && <span className="loading-indicator"> (Loading...)</span>}
          {isBuffering && !isLoading && <span className="buffering-indicator"> (Buffering...)</span>}
          {currentTrack?.unlisted && <span className="unlisted-indicator"> (Unlisted)</span>}
        </h3>
        {currentTrack?.genre && (
          <p className="track-genre">{currentTrack.genre}</p>
        )}
        {error && (
          <p className="error-message">{error}</p>
        )}
        {isLoading && loadProgress > 0 && loadProgress < 100 && (
          <div className="load-progress-container">
            <div className="load-progress-bar" style={{ width: `${loadProgress}%` }}></div>
          </div>
        )}
      </div>

      <div className="player-controls">
        <button
          className="control-btn nav-btn"
          onClick={onPrevious}
          disabled={!currentTrack || !canGoPrevious}
          title="Previous track (Left arrow)"
        >
          ⏮️
        </button>
        <button
          className="control-btn"
          onClick={isPlaying ? onPause : onPlay}
          disabled={!currentTrack}
          title={isPlaying ? "Pause (Space)" : "Play (Space)"}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button
          className="control-btn"
          onClick={onStop}
          disabled={!currentTrack}
          title="Stop"
        >
          ⏹️
        </button>
        <button
          className="control-btn nav-btn"
          onClick={onNext}
          disabled={!currentTrack || !canGoNext}
          title="Next track (Right arrow)"
        >
          ⏭️
        </button>
        <button
          className="control-btn qr-btn"
          onClick={() => setShowQRCode(!showQRCode)}
          disabled={!currentTrack}
          title="Show QR Code for mobile"
        >
          📱
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
      
      {showQRCode && (
        <div className="qr-code-popup">
          <div className="qr-code-container">
            <button className="close-qr" onClick={() => setShowQRCode(false)}>✖</button>
            <h3>Scan to listen on mobile</h3>
            <QRCodeSVG value={getCurrentUrl()} size={150} />
            <p className="qr-url">{getCurrentUrl()}</p>
          </div>
        </div>
      )}
    </div>
  );
};
