// src/providers/AudioProvider.jsx
import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
} from "react";

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(
    () => localStorage.getItem("musicPlaying") === "true"
  );

  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem("musicVolume");
    return savedVolume !== null ? parseFloat(savedVolume) : 0.3; // ← дефолтне значення тут
  });

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.volume = volume;
        audioRef.current.play().catch(() => {
          console.log("Автовідтворення заблоковано.");
        });
      }
    };

    if (isPlaying) {
      playAudio();
    }

    document.addEventListener("click", playAudio, { once: true });

    return () => {
      document.removeEventListener("click", playAudio);
    };
  }, [isPlaying, volume]);

  useEffect(() => {
    localStorage.setItem("musicPlaying", isPlaying.toString());
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    localStorage.setItem("musicVolume", volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const changeVolume = (v) => setVolume(v);

  return (
    <AudioContext.Provider
      value={{ isPlaying, togglePlay, volume, changeVolume }}
    >
      <audio ref={audioRef} src="/sprites/sounds/sound.mp3" loop />
      {children}
    </AudioContext.Provider>
  );
};
