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
app.post('/generate_strategy', async (req, res) => {
    try {
        const { track, car, tyres, laps } = req.body;

        if (!track || !car || !tyres || !laps) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: `Generate a racing strategy for ${track} using a ${car} on ${tyres} tyres over ${laps} laps.` }]
                        }
                    ]
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({ error: "Failed to fetch strategy", details: data });
        }

        res.json({ strategy: data });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on https://virtual-race-ai.onrender.com`);
});


