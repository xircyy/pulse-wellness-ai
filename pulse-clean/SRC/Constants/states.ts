export enum ScanState {
  IDLE = 'IDLE',               // "Tap to scan your pulse"
  SCANNING = 'SCANNING',       // Active PPG waveform and circle progress
  ERROR_MOTION = 'ERROR_MOV',  // "Motion detected. Hold still"
  ERROR_PRESSURE = 'ERROR_PR', // "Pressing too hard. Lighten your touch"
  SELECTING_CONTEXT = 'CONTEXT',// Choosing "Studying", "Resting", etc.[cite: 1]
  AWAITING_AI = 'AI_LOADING',  // "Reflecting on your reading..."[cite: 1]
  SHOWING_INSIGHT = 'RESULT'   // Final AI empathy output[cite: 1]
}