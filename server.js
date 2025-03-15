const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Test endpoint to check if server is running
app.get("/", (req, res) => {
    res.send("Virtual Race Manager API is running!");
});

// New /generate-strategy endpoint
app.post("/generate-strategy", (req, res) => {
    const raceData = req.body.raceData;

    if (!raceData) {
        return res.status(400).json({ error: "Missing race data" });
    }

    const strategy = `Suggested strategy for ${raceData.track} using ${raceData.car} with ${raceData.raceLaps} laps.`;

    res.json({ strategy });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
