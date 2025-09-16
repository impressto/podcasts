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
    isBuffering: false,
    isLoading: false,
    loadProgress: 0,
    error: null
  });

  const play = async () => {
    if (audioRef.current) {
      try {
        setPlayerState(prev => ({ ...prev, isLoading: true, error: null }));
        await audioRef.current.play();
        setPlayerState(prev => ({ 
          ...prev, 
          isPlaying: true, 
          isLoading: false 
        }));
        console.log('Audio playing successfully');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Play failed:', errorMessage);
        
        // Handle specific errors
        if (error instanceof DOMException) {
          if (error.name === 'NotAllowedError') {
            setPlayerState(prev => ({ 
              ...prev, 
              isPlaying: false, 
              isLoading: false,
              error: 'Browser autoplay policy prevents automatic playback. Please click the play button to listen.' 
            }));
          } else if (error.name === 'AbortError') {
            setPlayerState(prev => ({
              ...prev,
              isPlaying: false,
              isLoading: false,
              error: 'Playback was interrupted. Please try again.'
            }));
          } else {
            setPlayerState(prev => ({
              ...prev,
              isPlaying: false,
              isLoading: false,
              error: `Playback issue: ${error.name}. Please try again or use a different browser.`
            }));
          }
        } else {
          setPlayerState(prev => ({ 
            ...prev, 
            isPlaying: false, 
            isLoading: false,
            error: `Play failed: ${errorMessage}` 
          }));
        }
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayerState(prev => ({ 
        ...prev, 
        isPlaying: false,
        error: null 
      }));
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
    
    console.log('Loading track:', track);
    if (audioRef.current) {
      // Stop current playback
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // Reset state for new track
      setPlayerState(prev => ({ 
        ...prev, 
        currentTrack: track,
        currentTime: 0,
        isPlaying: false,
        isLoading: true,
        isBuffering: true,
        loadProgress: 0,
        error: null
      }));
      
      // Load new track
      audioRef.current.src = track.src;
      audioRef.current.load(); // Force reload
      
      console.log('Track loading started');
    } else {
      console.log('Audio ref is null');
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setPlayerState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const updateDuration = () => {
      setPlayerState(prev => ({ ...prev, duration: audio.duration || 0 }));
    };

    const handleEnded = () => {
      setPlayerState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        currentTime: 0,
        isBuffering: false,
        isLoading: false
      }));
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      
      let errorMessage = 'Unable to play this podcast';
      
      if (audio.error) {
        // Map media error codes to user-friendly messages
        switch (audio.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = 'Playback was aborted. Please try again.';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = 'A network error prevented loading the podcast. Please check your connection and try again.';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = 'The podcast file appears to be corrupted or in an unsupported format.';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'This podcast format is not supported by your browser or the source is unavailable.';
            break;
          default:
            errorMessage = `Error playing podcast: ${audio.error.message || 'Unknown error (code ' + audio.error.code + ')'}`;
        }
      }
      
      setPlayerState(prev => ({ 
        ...prev, 
        isPlaying: false,
        isLoading: false,
        isBuffering: false,
        error: errorMessage
      }));
    };

    const handleCanPlay = () => {
      console.log('Audio can play');
      setPlayerState(prev => ({ 
        ...prev, 
        isLoading: false
      }));
    };

    const handleLoadStart = () => {
      console.log('Audio load started');
      setPlayerState(prev => ({ 
        ...prev, 
        isLoading: true,
        isBuffering: true,
        loadProgress: 0 
      }));
    };

    const handleLoadedData = () => {
      console.log('Track loaded successfully');
      setPlayerState(prev => ({ 
        ...prev, 
        isLoading: false,
        loadProgress: 100
      }));
    };

    const handleWaiting = () => {
      console.log('Audio waiting/buffering');
      setPlayerState(prev => ({ ...prev, isBuffering: true }));
    };

    const handlePlaying = () => {
      console.log('Audio playing');
      setPlayerState(prev => ({ ...prev, isBuffering: false, isLoading: false }));
    };

    const handleProgress = () => {
      // Calculate load progress based on buffered ranges
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        const duration = audio.duration;
        if (duration > 0) {
          const loadProgress = Math.min(100, Math.round((bufferedEnd / duration) * 100));
          setPlayerState(prev => ({ ...prev, loadProgress }));
        }
      }
    };

    // Add event listeners
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('progress', handleProgress);

    // Cleanup function
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('progress', handleProgress);
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
