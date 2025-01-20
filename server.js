// Load environment variables
require("dotenv").config();
const apiKey = process.env.OPENAI_API_KEY;

// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

// Initialize the Express app
const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
app.use(express.static("public")); // Serve static files like CSS
app.set("view engine", "ejs"); // Set EJS as the template engine

// Ensure API key is available
if (!apiKey) {
  console.error("Error: OpenAI API key is not set. Check your .env file.");
  process.exit(1);
}

// Routes

// 1. Home Route
app.get("/", (req, res) => {
  res.render("index", { educatorData: null, aiResponse: null });
});

// 2. Generate Route
app.post("/generate", async (req, res) => {
  const { time, grades, environment, confidence, assessment } = req.body;

  // Construct the prompt
  const prompt = `
    Create a lesson plan and assessment based on the following details:
    Time available: ${time}
    Grade or age group: ${grades}
    Learning environment: ${environment}
    Confidence in hands-on projects: ${confidence}
    Include assessment: ${assessment === "yes" ? "Yes" : "No"}
  `;

  console.log("Generated Prompt:", prompt);

  try {
    // API call to OpenAI
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // Use the appropriate model
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000, // Limit response length
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract AI-generated output
    const output = response.data.choices[0].message.content;
    console.log("AI Response:", output);

    // Render the results
    res.render("index", {
      educatorData: req.body, // Pass form data back to the template
      aiResponse: output, // Pass AI response to the template
    });
  } catch (error) {
    // Log error details
    console.error("Error with OpenAI API:", error.response?.data || error.message);

    // Inform the user
    res.status(500).send("Failed to generate the lesson plan. Please try again.");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
