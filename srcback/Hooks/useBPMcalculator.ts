import { useState, useRef } from 'react';

export const useBPMCalculator = () => {
  const [currentBpm, setCurrentBpm] = useState<number>(0);
  const frames = useRef<number[]>([]);
  const lastPeak = useRef<number>(Date.now());

  const processFrame = (redIntensity: number) => {
    // 1. Add frame data to a sliding window
    frames.current.push(redIntensity);
    if (frames.current.length > 100) frames.current.shift();

    // 2. Simple Peak Detection Logic (Simplified for now)
    const threshold = 150; // Calibrate based on camera sensor
    if (redIntensity > threshold && (Date.now() - lastPeak.current) > 400) {
      const timeDiff = Date.now() - lastPeak.current;
      const bpm = Math.round(60000 / timeDiff);
      
      if (bpm > 40 && bpm < 180) { // Filter out noise
        setCurrentBpm(bpm);
        lastPeak.current = Date.now();
      }
    }
  };

  return { currentBpm, processFrame };
};