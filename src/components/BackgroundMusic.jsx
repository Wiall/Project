import React from "react";
import { useAudio } from "../providers/AudioProvider";

const BackgroundMusic = () => {
  const { isPlaying, togglePlay, volume, changeVolume } = useAudio();

  return (
    <div style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}>
      <button onClick={togglePlay}>{isPlaying ? "🔇" : "🔊"}</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => changeVolume(parseFloat(e.target.value))}
        style={{ marginLeft: "10px" }}
      />
    </div>
  );
};

export default BackgroundMusic;
