import React from 'react';
import type { AudioFile } from '../types/audio';
import './Playlist.css';

interface PlaylistProps {
  tracks: AudioFile[];
  currentTrack: AudioFile | null;
  onTrackSelect: (track: AudioFile) => void;
  onFileUpload?: (files: FileList) => void;
}

export const Playlist: React.FC<PlaylistProps> = ({
  tracks,
  currentTrack,
  onTrackSelect,
}) => {
  return (
    <div className="playlist">
      <div className="playlist-header">
        <h2>Available Audio Tracks</h2>
      </div>

      <div className="track-list">
        {tracks.length === 0 ? (
          <div className="empty-playlist">
            <p>No audio tracks available</p>
            <p className="empty-subtitle">Check the audio folder for available files</p>
          </div>
        ) : (
          tracks.map((track) => (
                          <div
                key={track.id}
                className={`track-item ${
                  currentTrack?.id === track.id ? 'active' : ''
                } ${track.id.startsWith('preloaded-') ? 'preloaded' : ''}`}
                onClick={() => onTrackSelect(track)}
              >
              <div className="track-details">
                <div className="track-name">{track.title}</div>
                {track.artist && (
                  <div className="track-meta">{track.artist}</div>
                )}
              </div>
              <div className="track-actions">
                {currentTrack?.id === track.id && (
                  <span className="now-playing">♪</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
