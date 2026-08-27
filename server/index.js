require("dotenv").config();

const API_KEY = process.env.GEMINI_API_KEY;

async function askAI() {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Explain React useState in simple words"
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();

console.log(JSON.stringify(data, null, 2));
}

askAI();