import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  toggleMusic: () => void;
  toggleMute: () => void;
  setVolume: (vol: number) => void;
  currentTrack: string;
  setTrack: (track: string) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Relaxing Islamic/Ney style music URLs (royalty-free)
const MUSIC_TRACKS = {
  ney: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0ef4f6a0e.mp3?filename=arabian-ambient-2-13310.mp3',
  peaceful: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_946c4e7d09.mp3?filename=middle-east-127104.mp3',
  meditation: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_91b32e02f9.mp3?filename=ambient-piano-amp-strings-10711.mp3',
};

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.3);
  const [currentTrack, setCurrentTrack] = useState('ney');
  const soundRef = useRef<Audio.Sound | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    loadSettings();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying && !isLoadingRef.current) {
      playMusic();
    }
  }, [currentTrack]);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('music_settings');
      if (settings) {
        const { isPlaying: savedPlaying, isMuted: savedMuted, volume: savedVolume, track } = JSON.parse(settings);
        setIsMuted(savedMuted || false);
        setVolumeState(savedVolume || 0.3);
        setCurrentTrack(track || 'ney');
        // Don't auto-play on load
      }
    } catch (error) {
      console.error('Error loading music settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('music_settings', JSON.stringify({
        isPlaying,
        isMuted,
        volume,
        track: currentTrack
      }));
    } catch (error) {
      console.error('Error saving music settings:', error);
    }
  };

  const playMusic = async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      // Unload existing sound
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      // Load and play new sound
      const trackUrl = MUSIC_TRACKS[currentTrack as keyof typeof MUSIC_TRACKS] || MUSIC_TRACKS.ney;
      const { sound } = await Audio.Sound.createAsync(
        { uri: trackUrl },
        { 
          shouldPlay: true, 
          isLooping: true,
          volume: isMuted ? 0 : volume
        }
      );
      
      soundRef.current = sound;
      setIsPlaying(true);
      saveSettings();
    } catch (error) {
      console.error('Error playing music:', error);
      setIsPlaying(false);
    } finally {
      isLoadingRef.current = false;
    }
  };

  const stopMusic = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setIsPlaying(false);
      saveSettings();
    } catch (error) {
      console.error('Error stopping music:', error);
    }
  };

  const toggleMusic = async () => {
    if (isPlaying) {
      await stopMusic();
    } else {
      await playMusic();
    }
  };

  const toggleMute = async () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(newMuted ? 0 : volume);
    }
    saveSettings();
  };

  const setVolume = async (vol: number) => {
    setVolumeState(vol);
    if (soundRef.current && !isMuted) {
      await soundRef.current.setVolumeAsync(vol);
    }
    saveSettings();
  };

  const setTrack = (track: string) => {
    setCurrentTrack(track);
  };

  return (
    <MusicContext.Provider value={{
      isPlaying,
      isMuted,
      volume,
      toggleMusic,
      toggleMute,
      setVolume,
      currentTrack,
      setTrack
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
