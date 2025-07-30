'use client';

import { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import Image from 'next/image';

// Sample images for the slideshow - you can replace these with actual birthday images
const slideshowImages = [
  '/next.svg', // Placeholder - replace with actual birthday images
  '/vercel.svg', // Placeholder - replace with actual birthday images
  '/globe.svg', // Placeholder - replace with actual birthday images
  '/window.svg', // Placeholder - replace with actual birthday images
  '/file.svg', // Placeholder - replace with actual birthday images
];

export default function Home() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600,
  });

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % slideshowImages.length
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Stop confetti after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Audio controls
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src="/Kaun Talha - Talha Anjum (pagalall.com).mp3"
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Confetti */}
      {showConfetti && (
        <div className="confetti-container">
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={200}
            colors={['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#9370DB', '#32CD32']}
          />
        </div>
      )}

      {/* Floating balloons effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div className="w-4 h-6 bg-gradient-to-b from-pink-400 to-purple-500 rounded-full opacity-60"></div>
          </div>
        ))}
      </div>

      {/* Audio Controls - Fixed Position */}
      <div className="fixed top-4 right-4 z-50 bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <div className="flex flex-col items-center space-y-3">
          <h3 className="text-white text-sm font-semibold">🎵 Background Music</h3>
          
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-110"
          >
            {isPlaying ? (
              <span className="text-lg">⏸️</span>
            ) : (
              <span className="text-lg">▶️</span>
            )}
          </button>

          {/* Volume Control */}
          <div className="flex flex-col items-center space-y-1">
            <span className="text-white text-xs">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #fff 0%, #fff ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
          </div>

          {/* Song Info */}
          <div className="text-center">
            <p className="text-white text-xs font-medium">Kaun Talha</p>
            <p className="text-gray-300 text-xs">Talha Anjum</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-screen p-8">
        {/* Left side - Birthday message */}
        <div className="flex-1 text-center lg:text-left lg:pr-8 mb-8 lg:mb-0">
          <div className="space-y-6">
            {/* Birthday title */}
            <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
              Happy Birthday!
            </h1>
            
            {/* Birthday message */}
            <div className="space-y-4">
              <p className="text-2xl lg:text-3xl text-white font-light">
                🎉 Wishing you a day filled with joy, laughter, and wonderful surprises! 🎂
              </p>
              <p className="text-xl text-gray-300">
                May all your dreams come true and may this year bring you endless happiness! ✨
              </p>
            </div>

            {/* Birthday cake emoji */}
            <div className="text-8xl animate-bounce">
              🎂
            </div>

            {/* Interactive button to restart confetti */}
            <button
              onClick={() => {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 10000);
              }}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-full hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              🎊 More Confetti! 🎊
            </button>
          </div>
        </div>

        {/* Right side - Slideshow */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/10">
            <h2 className="text-2xl font-bold text-center text-white mb-6">
              📸 Birthday Memories 📸
            </h2>
            
            {/* Slideshow container */}
            <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-xl">
              {slideshowImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    index === currentImageIndex
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Birthday memory ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    priority={index === 0}
                  />
                </div>
              ))}
              
              {/* Slideshow navigation dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slideshowImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-white scale-125'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Slideshow controls */}
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={() => setCurrentImageIndex((prev) => 
                  prev === 0 ? slideshowImages.length - 1 : prev - 1
                )}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                ← Previous
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => 
                  (prev + 1) % slideshowImages.length
                )}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white/60 text-sm">
        <p>🎉 Made with love for your special day! 🎉</p>
      </footer>
    </div>
  );
}
