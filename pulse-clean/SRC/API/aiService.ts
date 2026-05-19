// /src/api/aiService.ts

// We updated this to your exact laptop IP! (Assuming your backend runs on port 3000)
const BACKEND_URL = 'http://10.10.219.250:3000';

export const fetchAIInsight = async (bpm: number, contextId: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

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
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.insight; // The AI-generated string
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Error fetching AI insight:", error);
    return "Your heart is working hard right now. Take a deep breath and let's find a moment of calm together."; 
    // Fallback empathy message
  }
};