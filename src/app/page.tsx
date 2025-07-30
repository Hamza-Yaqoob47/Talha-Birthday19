'use client';

import { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import Image from 'next/image';

// Birthday images from the images folder
const slideshowImages = [
  '/images/WhatsApp Image 2025-07-30 at 23.48.43_0180695f.jpg',
  '/images/WhatsApp Image 2025-07-30 at 23.48.41_3c52c34e.jpg',
  '/images/WhatsApp Image 2025-07-30 at 23.48.40_3a6672d0.jpg',
  '/images/WhatsApp Image 2025-07-30 at 23.48.40_e8d59e2b.jpg',
  '/images/WhatsApp Image 2025-07-30 at 23.48.39_9f745acb.jpg',
];

export default function Home() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [balloons, setBalloons] = useState<Array<{id: number, left: string, delay: string, duration: string}>>([]);
  const [isClient, setIsClient] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 800,
    height: 600,
  });

  // Set client flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate balloons after client-side hydration
  useEffect(() => {
    if (isClient) {
      const balloonData = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
        duration: `${2 + Math.random() * 2}s`,
      }));
      setBalloons(balloonData);
    }
  }, [isClient]);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== 'undefined') {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
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

  // Audio controls with better error handling
  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        console.log('Audio element:', audioRef.current);
        console.log('Audio readyState:', audioRef.current.readyState);
        console.log('Audio networkState:', audioRef.current.networkState);
        console.log('Audio src:', audioRef.current.src);
        
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          // Try to play the audio
          console.log('Attempting to play audio...');
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            console.log('Audio play promise resolved');
            setIsPlaying(true);
            setAudioError(null);
          }
        }
      } catch (error) {
        console.error('Audio playback error:', error);
        
        // Try fallback audio
        try {
          const fallbackAudio = document.getElementById('fallback-audio') as HTMLAudioElement;
          if (fallbackAudio) {
            console.log('Trying fallback audio...');
            fallbackAudio.volume = volume;
            await fallbackAudio.play();
            setIsPlaying(true);
            setAudioError(null);
            console.log('Fallback audio started successfully');
          } else {
            setAudioError('Click to enable audio playback');
            setIsPlaying(false);
          }
        } catch (fallbackError) {
          console.error('Fallback audio error:', fallbackError);
          setAudioError('Click to enable audio playback');
          setIsPlaying(false);
        }
      }
    } else {
      console.error('Audio ref is null');
      setAudioError('Audio element not found');
    }
  };

  // Test audio function
  const testAudio = () => {
    if (audioRef.current) {
      console.log('=== AUDIO TEST ===');
      console.log('Audio element exists:', !!audioRef.current);
      console.log('Audio src:', audioRef.current.src);
      console.log('Audio readyState:', audioRef.current.readyState);
      console.log('Audio networkState:', audioRef.current.networkState);
      console.log('Audio paused:', audioRef.current.paused);
      console.log('Audio currentTime:', audioRef.current.currentTime);
      console.log('Audio duration:', audioRef.current.duration);
      console.log('Audio volume:', audioRef.current.volume);
      console.log('Audio muted:', audioRef.current.muted);
      console.log('==================');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Set initial volume and handle audio events
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      
      // Handle audio events
      const audio = audioRef.current;
      
      const handleCanPlay = () => {
        console.log('Audio can play');
        setAudioReady(true);
        setAudioError(null);
      };
      
      const handlePlay = () => {
        console.log('Audio started playing');
        setIsPlaying(true);
        setAudioError(null);
      };
      
      const handlePause = () => {
        console.log('Audio paused');
        setIsPlaying(false);
      };
      
      const handleError = (e: Event) => {
        console.error('Audio error:', e);
        const target = e.target as HTMLAudioElement;
        console.error('Audio error details:', target.error);
        setAudioError('Audio file not found or cannot be played');
        setIsPlaying(false);
        setAudioReady(false);
      };
      
      const handleEnded = () => {
        console.log('Audio ended');
        setIsPlaying(false);
      };

      const handleLoadStart = () => {
        console.log('Audio loading started');
      };

      const handleLoadedData = () => {
        console.log('Audio data loaded');
        setAudioReady(true);
      };

      const handleCanPlayThrough = () => {
        console.log('Audio can play through');
        setAudioReady(true);
      };

      // Add all event listeners
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('error', handleError);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('loadeddata', handleLoadedData);

      // Try to load the audio
      audio.load();

      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [volume]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src="/kaun.mp3"
        loop
        preload="metadata"
      />

      {/* Fallback Audio Player (hidden) */}
      <audio
        id="fallback-audio"
        src="/kaun.mp3"
        loop
        preload="metadata"
        style={{ display: 'none' }}
      />

      {/* Confetti */}
      {showConfetti && isClient && (
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

      {/* Floating balloons effect - Only render after client-side hydration */}
      {isClient && (
        <div className="absolute inset-0 pointer-events-none">
          {balloons.map((balloon) => (
            <div
              key={balloon.id}
              className="absolute animate-bounce"
              style={{
                left: balloon.left,
                animationDelay: balloon.delay,
                animationDuration: balloon.duration,
              }}
            >
              <div className="w-4 h-6 bg-gradient-to-b from-pink-400 to-purple-500 rounded-full opacity-60"></div>
            </div>
          ))}
        </div>
      )}

      {/* Audio Controls - Fixed Position */}
      <div className="fixed top-4 right-4 z-50 bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <div className="flex flex-col items-center space-y-3">
          <h3 className="text-white text-sm font-semibold">🎵 Background Music</h3>
          
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 ${
              audioReady 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700' 
                : 'bg-gray-500 cursor-not-allowed'
            }`}
            title={audioError || (isPlaying ? 'Pause music' : 'Play music')}
            disabled={!audioReady}
          >
            {isPlaying ? (
              <span className="text-lg">⏸️</span>
            ) : (
              <span className="text-lg">▶️</span>
            )}
          </button>

          {/* Status messages */}
          {!audioReady && !audioError && (
            <p className="text-yellow-300 text-xs text-center max-w-24">
              Loading audio...
            </p>
          )}
          
          {audioError && (
            <p className="text-red-300 text-xs text-center max-w-24">
              {audioError}
            </p>
          )}

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

          {/* Test Button */}
          <button
            onClick={testAudio}
            className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
          >
            Test Audio
          </button>
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
            
            {/* Personalized birthday message */}
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                Talha Yaqoob! 🎉
              </h2>
              <p className="text-2xl lg:text-3xl text-white font-light">
                🎂 Wishing you a day filled with joy, laughter, and wonderful surprises! 🎊
              </p>
              <p className="text-xl text-gray-300">
                May all your dreams come true and may this year bring you endless happiness! ✨
              </p>
              <p className="text-lg text-gray-400">
                You deserve all the love, success, and beautiful moments life has to offer! 🌟
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
              📸 Talha&apos;s Birthday Memories 📸
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
                    alt={`Talha's birthday memory ${index + 1}`}
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
        <p>🎉 Happy Birthday Talha Yaqoob! 🎉</p>
      </footer>
    </div>
  );
}
