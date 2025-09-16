import { useState, useEffect } from 'react';
import { AudioPlayer } from './components/AudioPlayer';
import { Playlist } from './components/Playlist';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import type { AudioFile } from './types/audio';
import './App.css';

function App() {
  const [tracks, setTracks] = useState<AudioFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { audioRef, playerState, play, pause, stop, setVolume, seek, loadTrack } = useAudioPlayer();

  // Fetch tracks from JSON file
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        // Use environment variable for tracks URL, with a fallback
        const tracksUrl = import.meta.env.VITE_APP_IMPRESSTO_TRACKS_URL || '/homelab/tracks.json';
        console.log('Fetching tracks from:', tracksUrl);
        
        const response = await fetch(tracksUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch tracks: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setTracks(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tracks:', error);
        setLoadError(error instanceof Error ? error.message : 'Unknown error');
        setIsLoading(false);
      }
    };
    
    fetchTracks();
  }, []);

  // Auto-select track based on URL hash or default to first track
  useEffect(() => {
    // Don't try to load tracks if they're not ready yet
    if (isLoading || tracks.length === 0) return;

    const loadTrackFromHash = () => {
      const hash = window.location.hash.substring(1); // Remove the # symbol
      let trackToLoad = tracks[0]; // Default to first track

      if (hash) {
        // Try to find track by hash
        if (hash === 'track-1' && tracks.length >= 1) {
          trackToLoad = tracks[0];
        } else if (hash === 'track-2' && tracks.length >= 2) {
          trackToLoad = tracks[1];
        } else if (hash === 'track-3' && tracks.length >= 3) {
          trackToLoad = tracks[2];
        } else if (hash === 'track-4' && tracks.length >= 4) {
          trackToLoad = tracks[3];
        } else if (hash === 'track-5' && tracks.length >= 5) {
          trackToLoad = tracks[4];
        } else if (hash === 'track-6' && tracks.length >= 6) {
          trackToLoad = tracks[5];
        }
      }

      // Only load the track once on initial mount
      if (trackToLoad && !playerState.currentTrack) {
        loadTrack(trackToLoad);
        console.log('Auto-loaded track from hash:', hash || 'default');
      }
    };

    // Load initial track
    loadTrackFromHash();

    // Listen for hash changes (browser back/forward)
    window.addEventListener('hashchange', loadTrackFromHash);

    return () => {
      window.removeEventListener('hashchange', loadTrackFromHash);
    };
  }, [tracks, isLoading, loadTrack, playerState.currentTrack]); // Added playerState.currentTrack to check if a track is loaded

  // Update URL hash when track changes
  const handleTrackSelect = (track: AudioFile) => {
    console.log('Track selected:', track.title);

    // Update URL hash based on track
    let hash = '';
    
    // Get the track number from the id (preloaded-X)
    if (track.id.startsWith('preloaded-')) {
      const trackNumber = track.id.split('-')[1];
      hash = `track-${trackNumber}`;
    }

    if (hash) {
      window.history.replaceState(null, '', `#${hash}`);
    }

    loadTrack(track); // Auto-play is true by default
  };

  // Navigation functions
  const handleNext = () => {
    const currentIndex = tracks.findIndex(track => track.id === playerState.currentTrack?.id);
    if (currentIndex < tracks.length - 1) {
      const nextTrack = tracks[currentIndex + 1];
      handleTrackSelect(nextTrack);
    }
  };

  const handlePrevious = () => {
    const currentIndex = tracks.findIndex(track => track.id === playerState.currentTrack?.id);
    if (currentIndex > 0) {
      const previousTrack = tracks[currentIndex - 1];
      handleTrackSelect(previousTrack);
    }
  };

  // Calculate canGoNext and canGoPrevious
  const canGoNext = tracks.findIndex(track => track.id === playerState.currentTrack?.id) < tracks.length - 1;
  const canGoPrevious = tracks.findIndex(track => track.id === playerState.currentTrack?.id) > 0;

  // Add keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard shortcuts if we have tracks loaded
      if (tracks.length === 0 || !playerState.currentTrack) return;
      
      switch (e.key) {
        case ' ': // Space bar
          e.preventDefault();
          playerState.isPlaying ? pause() : play();
          break;
        case 'ArrowRight': // Right arrow
          if (canGoNext) handleNext();
          break;
        case 'ArrowLeft': // Left arrow
          if (canGoPrevious) handlePrevious();
          break;
        case 'ArrowUp': // Up arrow
          e.preventDefault();
          setVolume(Math.min(1, playerState.volume + 0.1));
          break;
        case 'ArrowDown': // Down arrow
          e.preventDefault();
          setVolume(Math.max(0, playerState.volume - 0.1));
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [tracks, playerState, play, pause, handleNext, handlePrevious, setVolume, canGoNext, canGoPrevious]);

  return (
    <div className="app">
      <audio
        ref={audioRef}
        preload="metadata"
        crossOrigin="anonymous"
      />

      <main className="app-main">
        {isLoading ? (
          <div className="loading-container">
            <p>Loading tracks...</p>
          </div>
        ) : loadError ? (
          <div className="error-container">
            <p>Error loading tracks: {loadError}</p>
          </div>
        ) : (
          <>
            <AudioPlayer
              playerState={playerState}
              onPlay={play}
              onPause={pause}
              onStop={stop}
              onVolumeChange={setVolume}
              onSeek={seek}
              onNext={handleNext}
              onPrevious={handlePrevious}
              canGoNext={canGoNext}
              canGoPrevious={canGoPrevious}
            />

            <Playlist
              tracks={tracks}
              currentTrack={playerState.currentTrack}
              onTrackSelect={handleTrackSelect}
            />
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Streaming audio content from impressto.ca</p>
        {tracks.length > 0 && (
          <>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '8px' }}>
              Direct links: 
              {tracks.map((_, index) => (
                <span key={index}>
                  <a href={`#track-${index + 1}`} style={{ color: 'inherit', marginLeft: '5px' }}>
                    #{index + 1}
                  </a>
                  {index < tracks.length - 1 ? ',' : ''}
                </span>
              ))}
            </p>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '8px' }}>
              Keyboard shortcuts: Space (Play/Pause), ← → (Previous/Next), ↑ ↓ (Volume)
            </p>
          </>
        )}
      </footer>
    </div>
  );
}

export default App;
