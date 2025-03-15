import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// API Key Check Endpoint
app.get('/env-check', (req, res) => {
    if (process.env.GEMINI_API_KEY) {
        res.json({ message: "API Key Loaded" });
    } else {
        res.json({ message: "API Key is Undefined" });
    }
});

// Generate Strategy Endpoint
// Generate Strategy Endpoint
app.post('/generate_strategy', async (req, res) => {
    try {
        console.log("Received Data:", req.body); // 🛠 Log received data

        const { track, car, raceLaps, fuelLifespan, mandatoryTyre, tyres } = req.body;

        if (!track || !car || !raceLaps || !fuelLifespan || !tyres || tyres.length === 0) {
            return res.status(400).json({ error: "❌ Missing required fields" });
        }

        const promptText = `
            Generate an optimal racing strategy for ${car} on ${track} over ${raceLaps} laps.
            - Fuel lifespan: ${fuelLifespan} laps per tank
            - Mandatory tyre: ${mandatoryTyre}
            - Tyre options: ${tyres.map(t => `${t.compound} (${t.lifespan} laps, ${t.lapTime} sec)`).join(", ")}
            Provide a detailed race strategy considering fuel usage, tyre wear, and pit stops.
        `;

        console.log("Generated Prompt:", promptText); // 🛠 Log the generated prompt

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }]
                }),
            }
        );

        const data = await response.json();

        console.log("Gemini API Response:", data); // 🛠 Log response from Gemini

        if (!response.ok) {
            return res.status(500).json({ error: "❌ Failed to fetch strategy", details: data });
        }

        res.json({ strategy: data });
    } catch (error) {
        console.error("❌ Server Error:", error);
        res.status(500).json({ error: "❌ Internal Server Error" });
    }
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on https://virtual-race-ai.onrender.com`);
});
