const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

const OLLAMA_PATH = "C:/Users/waina/AppData/Local/Programs/Ollama/ollama"; // Adjust if necessary

app.post("/chat", (req, res) => {
    const userInput = req.body.message;
    console.log("User Input:", userInput);

    // Run Ollama command
    const process = spawn(OLLAMA_PATH, ["run", "llama2"]);

    let aiResponse = "";

    // Send user input to Ollama
    process.stdin.write(userInput + "\n");
    process.stdin.end(); // Close stdin after writing input

    // Capture AI output
    process.stdout.on("data", (data) => {
        aiResponse += data.toString();
    });

    // Capture errors
    process.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    });

    // Send response back when process finishes
    process.on("close", (code) => {
        if (code === 0) {
            console.log("AI Response:", aiResponse);
            res.json({ response: aiResponse.trim() });
        } else {
            res.status(500).json({ error: "Failed to process AI response." });
        }
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));
