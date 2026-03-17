import express from "express";
import Groq from "groq-sdk";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();





/* ======================
   AI STUDY ASSISTANT
====================== */

router.post("/assistant", authMiddleware, async (req, res) => {

  try {
    const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

    const { question, chapterName } = req.body;

    const response = await groq.chat.completions.create({

      model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",
          content: `
You are an academic study assistant.

Rules:
- Answer ONLY using concepts related to the given chapter.
- Use simple student-friendly explanations.
- Structure answers clearly.

Answer structure:
1. Short definition
2. Explanation
3. Example if helpful
4. Key takeaway

If the question is unrelated to the chapter, say:
"This question does not appear related to the chapter."
`
        },
        {
          role: "user",
          content: `
Chapter: ${chapterName}

Student Question:
${question}
`
        }
      ]

    });

    const answer =
      response.choices?.[0]?.message?.content || "No answer generated.";

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
   GENERATE MOCK TEST
====================== */

router.post("/generate-mock", authMiddleware, async (req, res) => {

  try {

    const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

    const { chapterName, difficulty } = req.body;

    /* ======================
       Adaptive Difficulty
    ====================== */

    let adaptiveDifficulty = difficulty || "Medium";


    /* ======================
       Strong Prompt
    ====================== */

    const prompt = `
Generate EXACTLY 10 UNIQUE multiple choice questions.

Chapter: "${chapterName}"
Difficulty: ${adaptiveDifficulty}

Rules:
1. Questions must be strictly from the chapter.
2. Do NOT repeat questions.
3. Each question must have exactly 4 options.
4. All options must be UNIQUE.
5. Only ONE correct answer.
6. The correct answer must appear inside the options.
7. Avoid trivial questions.

Return ONLY a JSON array.

Example format:

[
{
"id":1,
"question":"What is entropy?",
"options":["Energy","Disorder","Heat","Temperature"],
"correct":"Disorder"
}
]

No text before JSON.
No text after JSON.
`;

    const response = await groq.chat.completions.create({

      model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",
          content: "Generate academic MCQ questions. Output JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ]

    });

    let raw = response.choices?.[0]?.message?.content || "";



    /* ======================
       Clean AI Response
    ====================== */

    raw = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();



    /* ======================
       Extract JSON
    ====================== */

    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");

    if (start === -1 || end === -1) {
      throw new Error("Invalid AI response format");
    }

    raw = raw.substring(start, end + 1);



    /* ======================
       Parse JSON
    ====================== */

    let questions = JSON.parse(raw);



    /* ======================
       Remove Duplicate Options
    ====================== */

    questions = questions.map((q, index) => {

      const uniqueOptions = [...new Set(q.options)];

      return {
        id: index + 1,
        question: q.question,
        options: uniqueOptions.slice(0, 4),
        correct: q.correct
      };

    });



    /* ======================
       Remove Duplicate Questions
    ====================== */

    const seen = new Set();
    const uniqueQuestions = [];

    for (const q of questions) {

      if (!seen.has(q.question)) {
        uniqueQuestions.push(q);
        seen.add(q.question);
      }

    }



    res.json({
      questions: uniqueQuestions
    });

  } catch (error) {

    console.error("Mock generation error:", error);

    res.status(500).json({
      error: "Failed to generate mock test"
    });

  }

});

export default router;