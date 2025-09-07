import { useState, useEffect } from 'react';
import { AudioPlayer } from './components/AudioPlayer';
import { Playlist } from './components/Playlist';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import type { AudioFile } from './types/audio';
import './App.css';

function App() {
  // Pre-loaded tracks from the audio folder
  const initialTracks: AudioFile[] = [
    {
      id: 'preloaded-1',
      title: 'Mastering React Hooks and State Management',
      artist: 'Audio Tutorial',
      src: 'https://impressto.ca/audio/mastering_react_hooks_and_state_management.m4a',
    },
    {
      id: 'preloaded-2',
      title: 'React Classes and Hooks',
      artist: 'Component Design Tutorial',
      src: 'https://impressto.ca/audio/classes_and_hooks_navigating_reacts_evolving_components.m4a',
    },
    {
      id: 'preloaded-3',
      title: 'React Deep Dive into useState and useEffect',
      artist: 'React Development Tutorial',
      src: 'https://impressto.ca/audio/react_hooks_demystified.m4a',
    },
    {
      id: 'preloaded-4',
      title: 'Redux: Taming State Chaos with Redux',
      artist: 'State Management Tutorial',
      src: 'https://impressto.ca/audio/redux_taming_state_chaos.m4a',
    },
    {
      id: 'preloaded-5',
      title: 'React: Building Dynamic UIs with JSX',
      artist: 'UI Development Tutorial',
      src: 'https://impressto.ca/audio/jsx_dynamic_react_ui.m4a',
    },
    {
      id: 'preloaded-6',
      title: 'Build Smart Greenhouses with ESP32 Meshes',
      artist: 'Environmental Podcast',
      src: 'https://impressto.ca/audio/building_a_smart_greenhouse.m4a'
    }

  ];

  const [tracks] = useState<AudioFile[]>(initialTracks);
  const { audioRef, playerState, play, pause, stop, setVolume, seek, loadTrack } = useAudioPlayer();

  // Auto-select track based on URL hash or default to first track
  useEffect(() => {
    const loadTrackFromHash = () => {
      const hash = window.location.hash.substring(1); // Remove the # symbol
      let trackToLoad = initialTracks[0]; // Default to first track

      if (hash) {
        // Try to find track by hash
        if (hash === 'track-1') {
          trackToLoad = initialTracks[0];
        } else if (hash === 'track-2') {
          trackToLoad = initialTracks[1];
        } else if (hash === 'track-3') {
          trackToLoad = initialTracks[2];
        } else if (hash === 'track-4') {
          trackToLoad = initialTracks[3];
        } else if (hash === 'track-5') {
          trackToLoad = initialTracks[4];
        } else if (hash === 'track-6') {
          trackToLoad = initialTracks[5];
        }
      }

      if (trackToLoad) {
        loadTrack(trackToLoad);
        setTimeout(() => { play(); }, 100); // Auto-play after loading
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
  }, []);

  // Update URL hash when track changes
  const handleTrackSelect = (track: AudioFile) => {
    console.log('Track selected:', track.title);

    // Update URL hash based on track
    let hash = '';
    if (track.id === 'preloaded-1') hash = 'track-1';
    else if (track.id === 'preloaded-2') hash = 'track-2';
    else if (track.id === 'preloaded-3') hash = 'track-3';
    else if (track.id === 'preloaded-4') hash = 'track-4';
    else if (track.id === 'preloaded-5') hash = 'track-5';
    else if (track.id === 'preloaded-6') hash = 'track-6';

    if (hash) {
      window.history.replaceState(null, '', `#${hash}`);
    }

    loadTrack(track);
    setTimeout(() => { play(); }, 100); // Auto-play after selecting
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

  return (
    <div className="app">
      <audio
        ref={audioRef}
        preload="metadata"
        crossOrigin="anonymous"
      />

      <main className="app-main">
        <AudioPlayer
          playerState={playerState}
          onPlay={play}
          onPause={pause}
          onStop={stop}
          onVolumeChange={setVolume}
          onSeek={seek}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={tracks.findIndex(track => track.id === playerState.currentTrack?.id) < tracks.length - 1}
          canGoPrevious={tracks.findIndex(track => track.id === playerState.currentTrack?.id) > 0}
        />

        <Playlist
          tracks={tracks}
          currentTrack={playerState.currentTrack}
          onTrackSelect={handleTrackSelect}
        />
      </main>

      <footer className="app-footer">
        <p>Streaming audio content from impressto.ca</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '8px' }}>
          Direct links: #track-1, #track-2, #track-3, #track-4, #track-5, #track-6
        </p>
      </footer>
    </div>
  );
}

export default App;
