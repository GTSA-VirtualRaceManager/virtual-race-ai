import 'dotenv/config';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ API Key is Undefined! Make sure the .env file exists and dotenv is loaded.");
} else {
    console.log("✅ API Key Loaded Successfully.");
}

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(bodyParser.json());

// ✅ Route to Check If API Key Is Loaded
app.get("/env-check", (req, res) => {
    res.json({ message: GEMINI_API_KEY ? `API Key Loaded` : "API Key is Undefined" });
});

// ✅ Generate AI-Based Race Strategy using Google Gemini API
app.post('/generate_strategy', async (req, res) => {
    const { track, car, tyres, laps } = req.body;
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `Generate a racing strategy for ${track} using a ${car} on ${tyres} tyres over ${laps} laps.` })
    });

    const data = await response.json();
    res.json(data);
});

        // 🏎️ Build Strategy Prompt
        const prompt = `
        You are a professional racing strategist. Using the following details, create the optimal pit stop strategy:
        
        - **Track**: ${raceData.track}
        - **Car**: ${raceData.car}
        - **Total Laps**: ${raceData.raceLaps}
        - **Fuel lasts**: ${raceData.fuelLifespan} laps per tank
        - **Mandatory Tyre Compound**: ${raceData.mandatoryTyre}

        **Tyre Data:**
        ${raceData.tyres.map(tyre => `- ${tyre.compound}: Lap Time = ${tyre.lapTime}s, Lifespan = ${tyre.lifespan} laps`).join("\n")}

        **Weather Conditions:**
        ${raceData.rainStartLap ? `Rain starts on lap ${raceData.rainStartLap} and ends on lap ${raceData.rainEndLap}.` : "No rain expected."}

        **Generate a detailed strategy including:**
        1. Which tyre to start on.
        2. When to pit for new tyres.
        3. Whether fuel refills are needed.
        4. Explanation of why this strategy is optimal.

        **🏁 Provide a professional, structured pit stop plan.**
        `;

        // 🔥 Call Google Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            })
        });

        const result = await response.json();

        if (result && result.candidates && result.candidates.length > 0) {
            res.json({ strategy: result.candidates[0].content });
        } else {
            throw new Error("No response from Google Gemini API");
        }

    } catch (error) {
        console.error("Google Gemini API Error:", error);
        res.status(500).json({ error: "Failed to generate strategy" });
    }
});

// ✅ Start the Server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
