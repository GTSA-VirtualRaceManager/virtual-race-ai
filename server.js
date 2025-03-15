const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// OpenAI API Key (Stored in Render Environment Variable)
const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
}));

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
        - If rain occurs, transi
