import { useEffect, useRef, useState } from 'react';
import type { AudioFile, PlayerState } from '../types/audio';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    currentTrack: null,
  });

  const play = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setPlayerState(prev => ({ ...prev, isPlaying: true }));
        console.log('Audio playing successfully'); // Debug log
      } catch (error) {
        console.error('Play failed:', error);
        setPlayerState(prev => ({ ...prev, isPlaying: false }));
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayerState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setPlayerState(prev => ({ ...prev, volume }));
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setPlayerState(prev => ({ ...prev, currentTime: time }));
    }
  };

  const loadTrack = (track: AudioFile) => {
    // Skip if trying to load the same track that's already loaded
    if (playerState.currentTrack?.id === track.id) {
      console.log('Track already loaded:', track.title);
      return;
    }
    
    console.log('Loading track:', track); // Debug log
    if (audioRef.current) {
      // Stop current playback
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // Load new track
      audioRef.current.src = track.src;
      audioRef.current.load(); // Force reload
      
      setPlayerState(prev => ({ 
        ...prev, 
        currentTrack: track,
        currentTime: 0,
        isPlaying: false 
      }));
      console.log('Track loaded successfully'); // Debug log
    } else {
      console.log('Audio ref is null'); // Debug log
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setPlayerState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const updateDuration = () => {
      setPlayerState(prev => ({ ...prev, duration: audio.duration }));
    };

    const handleEnded = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleCanPlay = () => {
      console.log('Audio can play');
    };

    const handleLoadStart = () => {
      console.log('Audio load started');
    };

    const handleLoadedData = () => {
      console.log('Audio loaded data');
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  return {
    audioRef,
    playerState,
    play,
    pause,
    stop,
    setVolume,
    seek,
    loadTrack,
  };
};
