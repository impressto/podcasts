import { useState, useEffect, useMemo } from 'react';
import { AudioPlayer } from './components/AudioPlayer';
import { Playlist } from './components/Playlist';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import type { AudioFile } from './types/audio';
import './App.css';

// Function to check if we're in standalone mode (single podcast)
// Using hash-based parameters instead of query parameters for better Nginx compatibility
const isStandaloneMode = () => {
  const hash = window.location.hash.substring(1);
  
  // Split hash by delimiters
  const parts = hash.split(/[\/;]+/);
  
  // Check for standalone parameter
  return parts.includes('standalone') || 
         parts.includes('mode=standalone') || 
         parts.some(part => part === 'standalone=true');
};

function App() {
  const [allTracks, setAllTracks] = useState<AudioFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { audioRef, playerState, play, pause, stop, setVolume, seek, loadTrack } = useAudioPlayer();
  // Standalone mode determined by URL parameter
  const [standalone, setStandalone] = useState(isStandaloneMode());
  
  // Filter out unlisted tracks for the public playlist
  const tracks = useMemo(() => {
    return allTracks.filter(track => !track.unlisted);
  }, [allTracks]);

  // Fetch tracks from JSON file
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        // Use environment variable for tracks URL, with a fallback
        const tracksUrl = import.meta.env.VITE_APP_IMPRESSTO_TRACKS_URL || '/homelab/tracks.json';
        console.log('Fetching tracks from:', tracksUrl);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        try {
          const response = await fetch(tracksUrl, { 
            signal: controller.signal,
            headers: { 'Cache-Control': 'no-cache' } 
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error('Podcast data not found. The resource may have been moved or deleted.');
            } else if (response.status >= 500) {
              throw new Error('Server error. Our podcast server is currently experiencing issues.');
            } else {
              throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
            }
          }
          
          const data = await response.json();
          
          if (!Array.isArray(data) || data.length === 0) {
            throw new Error('No podcast tracks available.');
          }
          
          setAllTracks(data);
          setIsLoading(false);
        } catch (fetchError) {
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            throw new Error('Request timed out. Please check your connection and try again.');
          }
          throw fetchError;
        }
      } catch (error) {
        console.error('Error fetching tracks:', error);
        setLoadError(error instanceof Error ? error.message : 'Unknown error loading podcasts');
        setIsLoading(false);
      }
    };
    
    fetchTracks();
  }, []);

  // Auto-select track based on URL hash or default to first track
  useEffect(() => {
    // Don't try to load tracks if they're not ready yet
    if (isLoading || allTracks.length === 0) return;

    const parseHash = () => {
      // Get the hash without the # symbol
      const fullHash = window.location.hash.substring(1);
      
      // Split by / or ; to get different parts
      const hashParts = fullHash.split(/[\/;]+/);
      
      // Check for track ID or standalone mode
      let trackId = null;
      let standalone = false;
      
      for (const part of hashParts) {
        // Track identifier checks
        if (part.startsWith('track-') || part.startsWith('preloaded-') || part.startsWith('unlisted-')) {
          trackId = part;
        } else if (part.startsWith('track=')) {
          trackId = part.split('=')[1];
        }
        
        // Standalone mode checks
        if (part === 'standalone' || 
            part === 'mode=standalone' || 
            part === 'standalone=true') {
          standalone = true;
        }
      }
      
      return { trackId, standalone };
    };

    const { trackId, standalone: hashStandalone } = parseHash();
    
    // Update standalone state if it changed
    if (hashStandalone !== standalone) {
      setStandalone(hashStandalone);
    }
    
    if (!trackId && standalone) {
      // In standalone mode, we must have a track identifier
      setLoadError("No track specified. Please use a URL with a track hash.");
      return;
    }

    const loadTrackFromHash = () => {
      const { trackId } = parseHash();
      let trackToLoad: AudioFile | undefined = undefined;

      if (trackId) {
        // First check if it's a direct ID in the hash - including unlisted tracks
        trackToLoad = allTracks.find(track => track.id === trackId);

        // If not found by direct ID, try the track-N format
        if (!trackToLoad) {
          // For track-N format, only consider public tracks for normal track numbers
          const publicTracks = allTracks.filter(track => !track.unlisted);
          
          if (trackId === 'track-1' && publicTracks.length >= 1) {
            trackToLoad = publicTracks[0];
          } else if (trackId === 'track-2' && publicTracks.length >= 2) {
            trackToLoad = publicTracks[1];
          } else if (trackId === 'track-3' && publicTracks.length >= 3) {
            trackToLoad = publicTracks[2];
          } else if (trackId === 'track-4' && publicTracks.length >= 4) {
            trackToLoad = publicTracks[3];
          } else if (trackId === 'track-5' && publicTracks.length >= 5) {
            trackToLoad = publicTracks[4];
          } else if (trackId === 'track-6' && publicTracks.length >= 6) {
            trackToLoad = publicTracks[5];
          }
        }
      }

      if (standalone && !trackToLoad) {
        setLoadError(`Track not found: ${trackId || 'None specified'}`);
        return;
      }

      // In non-standalone mode, default to first track if hash not found
      if (!trackToLoad && !standalone) {
        // Make sure we're only defaulting to a public track
        trackToLoad = tracks[0];
      }

      // Only load the track once on initial mount
      if (trackToLoad && !playerState.currentTrack) {
        // Check if we're trying to load an unlisted track in non-standalone mode
        if (trackToLoad.unlisted && !standalone && !trackId) {
          // If trying to auto-load an unlisted track without specific hash, choose a public one instead
          const firstPublicTrack = tracks[0];
          if (firstPublicTrack) {
            loadTrack(firstPublicTrack);
          }
        } else {
          loadTrack(trackToLoad);
        }
        
        console.log('Auto-loaded track from hash:', trackId || 'default');
      }
    };

    // Load initial track
    loadTrackFromHash();

    // Define handler for hash changes
    const handleHashChange = () => {
      const { standalone: newStandaloneValue } = parseHash();
      
      // Update standalone state if needed
      if (newStandaloneValue !== standalone) {
        setStandalone(newStandaloneValue);
      }
      
      loadTrackFromHash();
    };

    // Listen for hash changes (browser back/forward)
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [allTracks, tracks, isLoading, loadTrack, playerState.currentTrack, standalone]); // Updated dependencies

  // Update URL hash when track changes
  const handleTrackSelect = (track: AudioFile) => {
    console.log('Track selected:', track.title);

    // Update URL hash based on track
    let newTrackId = '';
    
    // Get the track number from the id (preloaded-X)
    if (track.id.startsWith('preloaded-')) {
      const trackNumber = track.id.split('-')[1];
      newTrackId = `track-${trackNumber}`;
    } else {
      // For other tracks, use their ID directly
      newTrackId = track.id;
    }

    if (newTrackId) {
      // If we're in standalone mode, preserve that parameter
      const newHash = standalone ? `track=${newTrackId};standalone=true` : `track=${newTrackId}`;
      window.history.replaceState(null, '', `#${newHash}`);
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
    <div className={`app ${standalone ? 'standalone-mode' : ''}`}>
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
            <h3 className="error-title">Unable to Load Podcasts</h3>
            <p className="error-message">
              We're having trouble loading the podcast content. This might be due to:
              <br />
              • A temporary network issue
              <br />
              • Server maintenance
              <br />
              • The content source being unavailable
            </p>
            <div className="error-details" style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '16px' }}>
              Technical details: {loadError}
            </div>
            <button onClick={() => window.location.reload()}>
              Refresh Page
            </button>
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
              onNext={standalone ? undefined : handleNext}
              onPrevious={standalone ? undefined : handlePrevious}
              canGoNext={standalone ? false : canGoNext}
              canGoPrevious={standalone ? false : canGoPrevious}
            />

            {!standalone && (
              <Playlist
                tracks={tracks}
                currentTrack={playerState.currentTrack}
                onTrackSelect={handleTrackSelect}
              />
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Streaming audio content from impressto.ca</p>
        {tracks.length > 0 && !standalone && (
          <>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '8px' }}>
              Direct links: 
              {tracks.map((_, index) => (
                <span key={index}>
                  <a href={`#track=track-${index + 1}`} style={{ color: 'inherit', marginLeft: '5px' }}>
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
        {standalone && playerState.currentTrack && (
          <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '8px' }}>
            Standalone podcast: {playerState.currentTrack.title}
            {playerState.currentTrack.genre && ` - ${playerState.currentTrack.genre}`}
            {playerState.currentTrack.unlisted && ' (Unlisted)'}
          </p>
        )}
      </footer>
    </div>
  );
}

export default App;
