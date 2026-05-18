// /src/api/aiService.ts

const BACKEND_URL = 'http://192.168.0.105:3000';

export const fetchAIInsight = async (bpm: number, contextId: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/generate-insight`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        heartRate: bpm,
        context: contextId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.insight; // The AI-generated string
  } catch (error) {
    console.error("Error fetching AI insight:", error);
    return "Your heart is working hard right now. Take a deep breath and let's find a moment of calm together."; 
    // Fallback empathy message
  }
};