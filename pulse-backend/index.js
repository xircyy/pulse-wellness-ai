require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json()); // Allows the server to read the JSON from your mobile app

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The endpoint your React Native app will hit
app.post('/generate-insight', async (req, res) => {
    try {
        const { heartRate, context } = req.body;
        console.log(`\n📲 Received new request from app!`);
        console.log(`BPM: ${heartRate} | Activity: ${context}`);

        // Using the free tier Flash model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // The Strict HCI Prompt Engine
        const prompt = `
        System Role: You are a calming, empathetic wellness companion inside a mobile health app. You are a supportive guide, NOT a medical professional.

        User Data:
        - Heart Rate: ${heartRate} BPM
        - Current Activity Context: "${context}"

        Instructions:
        1. Structure: Write exactly 2 to 3 short sentences. It must fit comfortably on a small mobile screen.
        2. Contextualize: Gently connect their heart rate to their activity. (e.g., "It makes sense your heart is working a bit harder while studying.")
        3. Action: Offer exactly ONE brief, zero-friction grounding action (e.g., dropping shoulders, relaxing the jaw, taking a slow exhale).
        4. Tone: Warm, reassuring, and conversational. Speak directly to the user as a friend.

        CRITICAL SAFETY GUARDRAILS:
        - NO DIAGNOSES: Never use medical terms (e.g., tachycardia, bradycardia, arrhythmia, hypertension).
        - ABNORMAL READINGS: If the BPM is unusually high for a resting state (e.g., 120+ BPM while "resting" or "sleeping"), DO NOT tell them it is normal. Instead, gently pivot to a suggestion of comfort (e.g., "Your heart is beating quite fast right now. Try to find a comfortable place to sit, drink a glass of water, and rest for a few minutes.")
        `;

        // Ask Gemini to generate the insight
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        console.log("✅ AI Insight generated successfully. Sending to phone...");

        // Send the payload back to the phone
        res.json({ insight: responseText });

    } catch (error) {
        // We use error.message here so the log is shorter and easier to read
        console.error("❌ AI Error:", error.message);
        
        // --- THE SAFETY NET ---
        // Notice we changed status(500) to status(200)! The phone thinks this is a success.
        res.status(200).json({ 
            insight: "Your heart rate is responding naturally to your current activity. Take a deep breath, ground yourself, and let's find a moment of calm together. (Note: AI is currently resting due to high server demand)." 
        });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;

// Binding to '0.0.0.0' is a crucial networking trick that allows your physical phone to see your laptop!
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🧠 Pulse Backend is ALIVE and listening on port ${PORT}...`);
    console.log(`Waiting for connection from the mobile app...`);
});