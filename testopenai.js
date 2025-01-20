require("dotenv").config();
const axios = require("axios");

const apiKey = process.env.OPENAI_API_KEY;

const testOpenAI = async () => {
  const prompt = `
    Create a lesson plan for a 20-minute hands-on activity for 3rd-grade students in a classroom environment.
    Assume the educator is very confident in using hands-on projects and does not require an assessment.
  `;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("AI Response:", response.data.choices[0].message.content);
  } catch (error) {
    console.error("Error with OpenAI API:", error.response?.data || error.message);
  }
};

testOpenAI();

