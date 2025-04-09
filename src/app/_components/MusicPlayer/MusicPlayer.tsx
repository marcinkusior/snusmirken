import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Battery,
  Menu,
} from "lucide-react";
import "./MusicPlayer.css";

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const songs = [
    {
      title: "Clair de Lune",
      artist: "Claude Debussy",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      title: "Moonlight Sonata",
      artist: "Ludwig van Beethoven",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      title: "Four Seasons - Spring",
      artist: "Antonio Vivaldi",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateProgress);
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current?.duration ?? 0);
      });
      audioRef.current.addEventListener("ended", () => {
        handleNext();
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, []);

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
    if (audioRef.current) {
      audioRef.current.src = songs[currentSongIndex].url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1));
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = songs[currentSongIndex].url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSongSelect = (index: number) => {
    setCurrentSongIndex(index);
    if (audioRef.current) {
      audioRef.current.src = songs[index].url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white p-4">
      <audio ref={audioRef} src={songs[currentSongIndex].url} />

      {/* USB Stick Player Container */}
      <div className="relative w-[300px] overflow-hidden rounded-xl border-2 border-black">
        {/* USB Connector */}
        <div className="absolute -top-4 left-1/2 h-8 w-16 -translate-x-1/2 rounded-t-lg border-2 border-black bg-white" />

        {/* Screen Area */}
        <div className="mt-8 p-4">
          {/* Status Bar */}
          {/* <div className="mb-4 flex items-center justify-between text-xs text-black">
            <Battery className="stroke-[1.5]" size={14} />
            <Volume2 className="stroke-[1.5]" size={14} />
          </div> */}

          {/* Display */}
          <div className="lcd-screen mb-6 rounded-lg border-2 border-black p-4">
            <div className="text-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="lcd-text font-bold">NOW PLAYING</span>
                <Menu className="stroke-[1.5]" size={14} />
              </div>
              <div className="lcd-text truncate text-lg font-bold">
                {songs[currentSongIndex].title}
              </div>
              <div className="lcd-text text-xs opacity-70">
                {songs[currentSongIndex].artist}
              </div>
            </div>

            {/* Dancing Cat */}
            {isPlaying && (
              <div className="mt-4 flex justify-center">
                <div className="dancing-cat">
                  <div className="ear-l"></div>
                  <div className="ear-r"></div>
                  <div className="face">
                    <div className="eye-l"></div>
                    <div className="eye-r"></div>
                    <div className="nose"></div>
                    <div className="mouth"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="lcd-pixel h-2 rounded-full">
                <div
                  className="h-full rounded-full bg-[#1a1f1b]"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="lcd-text mt-1 flex justify-between text-xs">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6 flex items-center justify-center gap-8">
            <button
              className="text-black transition-colors hover:text-black/70"
              onClick={handlePrevious}
            >
              <SkipBack className="stroke-[1.5]" size={24} />
            </button>
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black transition-colors hover:bg-black/5"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="stroke-[1.5]" size={24} />
              ) : (
                <Play className="stroke-[1.5]" size={24} />
              )}
            </button>
            <button
              className="text-black transition-colors hover:text-black/70"
              onClick={handleNext}
            >
              <SkipForward className="stroke-[1.5]" size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
