import React, { useRef, useEffect } from "react";

const BackgroundMusic = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          console.log(
            "Автовідтворення заблоковано браузером. Натисніть кнопку для старту."
          );
        });
      }
    };

    // Перевіряємо, чи був звук увімкнений перед перезавантаженням
    if (localStorage.getItem("musicPlaying") === "true") {
      playAudio();
    }

    document.addEventListener("click", playAudio); // Включаємо звук при кліку

    return () => {
      document.removeEventListener("click", playAudio); // Очищаємо подію
    };
  }, []);

  return <audio ref={audioRef} src="/sprites/sounds/sound.mp3" autoPlay loop />;
};

export default BackgroundMusic;
