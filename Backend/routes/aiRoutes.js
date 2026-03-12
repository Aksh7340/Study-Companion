import express from "express";
import Groq from "groq-sdk";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();



/* ======================
   AI Assistant
====================== */

router.post("/assistant", authMiddleware, async (req, res) => {

  try {

    const { question, chapterName } = req.body;

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const response = await groq.chat.completions.create({

      model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",
          content:
            "You are a helpful study assistant that explains academic concepts clearly for students."
        },
        {
          role: "user",
          content: `Chapter: ${chapterName}\nQuestion: ${question}`
        }
      ]

    });

    const answer =
      response.choices?.[0]?.message?.content || "No answer generated.";

    // Send structured chat object
    res.json({
      question,
      answer,
      createdAt: new Date()
    });

  } catch (error) {

    console.error("AI Assistant Error:", error);

    res.status(500).json({
      error: "AI assistant failed"
    });

  }

});



/* ======================
   Generate Mock Test
====================== */

router.post("/generate-mock", authMiddleware, async (req, res) => {

  try {

    const { chapterName, difficulty } = req.body;

    const prompt = `
Generate 10 multiple choice questions from the chapter "${chapterName}".
Difficulty level: ${difficulty || "Medium"}.

Return ONLY valid JSON array.

Example:

[
{
"id":1,
"question":"What is entropy?",
"options":["Energy","Disorder","Heat","Temperature"],
"correct":"Disorder"
}
]
`;

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const response = await groq.chat.completions.create({

      model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",
          content:
            "Generate academic MCQ questions. Output JSON only. No explanation."
        },
        {
          role: "user",
          content: prompt
        }
      ]

    });

    let raw = response.choices?.[0]?.message?.content || "";

    // Clean markdown blocks
    raw = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Extract JSON array if AI adds text
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");

    if (start === -1 || end === -1) {
      throw new Error("Invalid AI response format");
    }

    raw = raw.substring(start, end + 1);

    const questions = JSON.parse(raw);

    res.json({ questions });

  } catch (error) {

    console.error("Mock generation error:", error);

    res.status(500).json({
      error: "Failed to generate mock test"
    });

  }

});

export default router;