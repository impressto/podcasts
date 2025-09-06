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
      title: 'Building a Smart Greenhouse with an ESP32 Mesh',
      artist: 'Environmental Podcast',
      src: 'https://impressto.ca/audio/building_a_smart_greenhouse.m4a'
    },
    {
      id: 'preloaded-2',
      title: 'Mastering React Hooks and State Management',
      artist: 'Audio Tutorial',
      src: 'https://impressto.ca/audio/mastering_react_hooks_and_state_management.m4a',
    },
    {
      id: 'preloaded-3', 
      title: 'React: The Essential Guide to Modern Web Development',
      artist: 'Development Tutorial',
      src: 'https://impressto.ca/audio/react_the_essential_guide_to_modern_web_development.m4a',
    },
    {
      id: 'preloaded-4',
      title: 'Redux: Taming the State Chaos',
      artist: 'State Management Tutorial',
      src: 'https://impressto.ca/audio/redux_taming_state_chaos.m4a',
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
        }
      }
      
      if (trackToLoad) {
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
  }, []);

  // Update URL hash when track changes
  const handleTrackSelect = (track: AudioFile) => {
    console.log('Track selected:', track.title);
    
    // Update URL hash based on track
    let hash = '';
    if (track.id === 'preloaded-1') hash = 'track-1';
    else if (track.id === 'preloaded-2') hash = 'track-2';
    else if (track.id === 'preloaded-3') hash = 'track-3';
    
    if (hash) {
      window.history.replaceState(null, '', `#${hash}`);
    }
    
    loadTrack(track);
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
        />

        <Playlist
          tracks={tracks}
          currentTrack={playerState.currentTrack}
          onTrackSelect={handleTrackSelect}
        />
      </main>

      <footer className="app-footer">
        <p>Streaming audio content from impressto.ca</p>
        <p style={{fontSize: '0.8rem', opacity: 0.7, marginTop: '8px'}}>
          Direct links: #track-1, #track-2, #track-3
        </p>
      </footer>
    </div>
  );
}

export default App;
