import OpenAI from "openai";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// OpenAI API Initialization
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Test endpoint to check if server is running
app.get("/", (req, res) => {
    res.send("Virtual Race Manager API is running!");
});

// Generate strategy using AI
app.post("/generate-strategy", async (req, res) => {
    try {
        const raceData = req.body.raceData;

        if (!raceData || !raceData.tyres || raceData.tyres.length === 0) {
            return res.status(400).json({ error: "Incomplete race data" });
        }

        // Structure prompt with all inputs
        const prompt = `
        You are a racing strategy AI. Given the following data, create the best pit stop strategy:
        
        - Track: ${raceData.track}
        - Car: ${raceData.car}
        - Total Laps: ${raceData.raceLaps}
        - Fuel lasts for ${raceData.fuelLifespan} laps per tank.
        - Mandatory Tyre Compound: ${raceData.mandatoryTyre}

        **Tyre Options & Data**:
        ${raceData.tyres.map(tyre => `- ${tyre.compound}: Lap Time = ${tyre.lapTime}s, Lifespan = ${tyre.lifespan} laps`).join("\n")}

        **Weather Conditions**:
        ${raceData.rainStartLap ? `Rain starts on lap ${raceData.rainStartLap} and ends on lap ${raceData.rainEndLap}.` : "No rain expected."}

        **Strategy Calculation Requirements**:
        - The goal is to minimize pit stops while maintaining optimal performance.
        - Mandatory tyre compounds must be used for at least 1 lap.
        - Plan pit stops efficiently based on tyre degradation and fuel consumption.
        - If rain occurs, transition to intermediate or heavy wets if needed.

        Provide a clear pit stop plan in this format:
        1. Start on [Tyre Compound]
        2. Pit on Lap [X] → Change to [New Tyre]
        3. Pit on Lap [Y] → Change to [New Tyre]
        4. Fuel refills at [Lap Number] if required.
        5. Explanation of why this strategy works.

        **Final strategy output:**
        `;

        // Call OpenAI API
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 300,
            temperature: 0.7,
        });

        res.json({ strategy: response.choices[0].message.content.trim() });

    } catch (error) {
        console.error("OpenAI API Error:", error);
        res.status(500).json({ error: "Failed to generate strategy" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
