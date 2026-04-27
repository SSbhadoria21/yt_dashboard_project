import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate-notes", async (req, res) => {
  const { transcript } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mixtral-8x7b", // or another available model
        messages: [
          { role: "system", content: "You are a helpful note summarizer." },
          { role: "user", content: `Summarize this video into detailed study notes:\n${transcript}` }
        ]
      })
    });

    const data = await response.json();
    const notes = data.choices[0].message.content;
    res.json({ notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate notes" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
