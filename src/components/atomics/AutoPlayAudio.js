"use client";
import { useEffect, useRef } from 'react';

const AutoPlayAudio = ({ src }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    const playAudio = () => {
      audio.play().catch(error => {
        console.log('Error playing audio:', error);
      });
    };

    playAudio();

    // Optional: Re-attempt to play audio on user interaction if auto-play fails
    const handleInteraction = () => {
      playAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  return <audio ref={audioRef} src={src} />;
};

export default AutoPlayAudio;
