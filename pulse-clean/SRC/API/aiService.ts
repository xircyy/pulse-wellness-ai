// /src/api/aiService.ts

// Deployed on Render (free tier — first request after idle may take ~30s)
const BACKEND_URL = 'https://pulse-wellness-ai-backend.onrender.com';

export const fetchAIInsight = async (bpm: number, contextId: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout (Render free tier cold start)

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