import express from "express";
import Groq from "groq-sdk";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Validate API key at startup ───────────────────────────────────────────────
const API_KEY = process.env.GROQ_API_KEY;
if (!API_KEY) {
  console.error("⚠️  WARNING: GROQ_API_KEY is missing in .env file!");
}

/* ======================
   AI STUDY ASSISTANT
   FIX SUMMARY:
   1. subjectName validated BEFORE .trim() is called (was crashing on undefined)
   2. Removed "in ${cleanSubject}" appended to the user question (was confusing the model)
   3. System prompt rewritten to be unambiguous — chapter + subject are the ONLY scope
   4. Temperature lowered 0.7 → 0.3 (reduces hallucination / off-topic drift)
   5. max_tokens raised 500 → 900 (complex answers were getting cut off)
   6. Off-topic detection moved ONLY to system prompt (was duplicated & conflicting)
   7. User message simplified to just the question — no extra "IMPORTANT INSTRUCTION" noise
====================== */

router.post("/assistant", authMiddleware, async (req, res) => {
  try {
    const { question, chapterName, subjectName } = req.body;

    // ── 1. Validate inputs (subjectName BEFORE calling .trim()) ───────────────
    if (!question || typeof question !== "string" || question.trim() === "") {
      return res.status(400).json({
        error: "question is required and must be a non-empty string"
      });
    }

    if (!chapterName || typeof chapterName !== "string" || chapterName.trim() === "") {
      return res.status(400).json({
        error: "chapterName is required and must be a non-empty string"
      });
    }

    // BUG FIX: subjectName could be undefined — guard before calling .trim()
    const cleanSubject =
      subjectName && typeof subjectName === "string" && subjectName.trim() !== ""
        ? subjectName.trim()
        : "the current subject";

    const cleanChapter  = chapterName.trim();
    const cleanQuestion = question.trim();

    const groq = new Groq({ apiKey: API_KEY });

    // ── 2. Build a clear, unambiguous system prompt ───────────────────────────
    //    BUG FIX: Previous prompt said "Answer ONLY related to chapter X" but
    //    then the user message appended "in ${cleanSubject}" to the question,
    //    making the model think the student was asking broadly about the subject.
    //    Now the system prompt is the single source of truth for scope.

    const systemPrompt = `You are a dedicated academic tutor for the following course:

SUBJECT: "${cleanSubject}"
CHAPTER: "${cleanChapter}"

YOUR ONLY JOB:
Answer student questions that are directly about the topic "${cleanChapter}" as taught in the subject "${cleanSubject}". Nothing else.

STRICT SCOPE RULE:
- If the student's question is clearly related to "${cleanChapter}" in "${cleanSubject}", provide a helpful, accurate answer.
- If the student's question is about a COMPLETELY DIFFERENT subject, a DIFFERENT chapter, or is off-topic (e.g. general trivia, other programming languages unrelated to this chapter, personal questions), respond ONLY with this exact sentence:
  "I can only answer questions about '${cleanChapter}' in ${cleanSubject}. Please ask something related to this chapter."
- Do NOT provide any answer at all to off-topic questions — not even a partial one.

HOW TO JUDGE RELEVANCE:
- A question is ON-TOPIC if it uses concepts, terminology, syntax, or ideas from "${cleanChapter}" in "${cleanSubject}".
- Example: If the chapter is "Data Types" in "Introduction to R", then questions about numeric, character, logical, integer, complex, raw types in R, type coercion, typeof(), class(), is.*, as.* functions, vectors, factors — are ALL on-topic.
- A question asking about Python data types or SQL data types would be OFF-TOPIC.
- A question asking "what is 2+2" or "who invented the internet" would be OFF-TOPIC.

RESPONSE FORMAT (use this ONLY for on-topic answers):
Use exactly this Markdown structure:

**Brief Explanation:**
[Answer the question directly in 2–4 clear, natural sentences. Be specific to "${cleanChapter}" in "${cleanSubject}".]

**Example:**
[Give 1 concrete, practical example directly from "${cleanChapter}" in "${cleanSubject}". Use actual code, syntax, or real-world context as appropriate.]

**Key Takeaway:**
* [One bullet point summarising the most important concept to remember.]

TONE: Be clear, encouraging, and student-friendly. Do not be robotic. Do not repeat the question back.`;

    // ── 3. User message is JUST the question — no extra noise ─────────────────
    //    BUG FIX: Previous code appended "in ${cleanSubject}" to the student's
    //    question (e.g. "What are data types in Introduction to R"), which made
    //    the model interpret it as a broad general question rather than a
    //    chapter-specific one. Now the question is passed as-is.

    const response = await groq.chat.completions.create({
      model: "moonshotai/kimi-k2-instruct-0905",

      // temperature 0.3 — low for focused, on-topic academic answers
      // kimi-k2 recommended temp is 0.6 but 0.3 is better for strict scope adherence
      // Lower temperature = more focused, factual, on-topic responses.
      // Higher temperature causes the model to "wander" into unrelated areas.
      temperature: 0.3,

      // BUG FIX: max_tokens 500 → 900
      // Complex questions were getting cut off mid-answer at 500 tokens.
      // 900 gives enough room for a complete 3-part structured response.
      max_tokens: 900,

      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: cleanQuestion
        }
      ]
    });

    const answer =
      response.choices?.[0]?.message?.content ||
      "No answer could be generated. Please try again.";

    res.json({
      success: true,
      question: cleanQuestion,
      answer: answer,
      chapterName: cleanChapter,
      subjectName: cleanSubject,
      createdAt: new Date()
    });

  } catch (error) {
    console.error("❌ AI Assistant Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to generate answer",
      details: error.message
    });
  }
});

/* ======================
   GENERATE MOCK TEST
   FIX SUMMARY:
   1. subjectName validated BEFORE .trim() (same crash bug as assistant route)
   2. Temperature lowered 0.8 → 0.4 for more reliable JSON output
   3. System prompt restructured: subject + chapter stated at the very top
      so the model's first context is the exact scope, not general instructions
   4. Prompt de-cluttered: removed emoji overload that fragments model attention
   5. Trailing-comma JSON fix kept (it was correct)
====================== */

router.post("/generate-mock", authMiddleware, async (req, res) => {
  try {
    const { chapterName, subjectName, difficulty = "Medium" } = req.body;

    // ── Validate inputs ───────────────────────────────────────────────────────
    if (!chapterName || typeof chapterName !== "string" || chapterName.trim() === "") {
      return res.status(400).json({ error: "chapterName is required" });
    }

    const validDifficulties = ["Easy", "Medium", "Hard"];
    const cleanDifficulty = validDifficulties.includes(difficulty) ? difficulty : "Medium";

    // BUG FIX: guard subjectName before .trim()
    const cleanSubject =
      subjectName && typeof subjectName === "string" && subjectName.trim() !== ""
        ? subjectName.trim()
        : "the current subject";

    const cleanChapter = chapterName.trim();

    const groq = new Groq({ apiKey: API_KEY });

    console.log(
      `Generating mock test: "${cleanChapter}" (${cleanSubject}) | Difficulty: ${cleanDifficulty}`
    );

    // ── BUG FIX: System prompt now opens with the exact scope ─────────────────
    // Placing the subject and chapter at the VERY START of the system prompt
    // ensures the model's first context frame is the correct scope.
    // Previously, scope was buried inside general formatting instructions.

    const systemPrompt = `You are a test creator for the following course:

SUBJECT: "${cleanSubject}"
CHAPTER: "${cleanChapter}"

YOUR ONLY JOB: Generate exactly 10 unique multiple-choice questions that are STRICTLY about "${cleanChapter}" in "${cleanSubject}". Every single question must be directly relevant to this chapter.

OUTPUT RULES:
- Output ONLY a valid JSON array. Nothing else.
- No markdown fences (no \`\`\`json).
- No explanatory text before or after the JSON.
- Start immediately with [ and end with ].
- Use double quotes for all strings.
- No trailing commas.`;

    const userPrompt = `Generate exactly 10 multiple-choice questions about "${cleanChapter}" in "${cleanSubject}" at ${cleanDifficulty} difficulty.

MANDATORY: Every question must be directly about "${cleanChapter}". Do not include questions from other chapters or other subjects.

DIFFICULTY (${cleanDifficulty}):
- Easy: basic definitions and recall of concepts from "${cleanChapter}"
- Medium: application of concepts and connections between ideas in "${cleanChapter}"
- Hard: complex scenarios, analysis, and synthesis of concepts from "${cleanChapter}"

QUESTION DIVERSITY: Cover different sub-topics and concept types within "${cleanChapter}". No two questions should test the same concept.

VALIDATION BEFORE OUTPUT:
- Exactly 10 questions
- Each question has exactly 4 distinct options
- The "correct" value must exactly match one of the 4 options (same spelling, capitalization, spacing)
- All questions are genuinely about "${cleanChapter}" in "${cleanSubject}"

Output ONLY this JSON format:
[
  {
    "id": 1,
    "question": "Your question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": "Option A"
  }
]`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      // temperature 0.4 — slightly higher for diverse MCQ generation
      // llama3 excels at structured JSON output and instruction following
      // Lower temperature produces more reliable JSON structure and more
      // on-topic questions. 0.8 was causing JSON format errors and off-topic drift.
      temperature: 0.4,

      max_tokens: 3500,

      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt   }
      ]
    });

    let raw = response.choices?.[0]?.message?.content || "";
    console.log("Raw AI response length:", raw.length);

    // ── Clean and parse response ──────────────────────────────────────────────
    raw = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const start = raw.indexOf("[");
    const end   = raw.lastIndexOf("]");

    if (start === -1 || end === -1) {
      throw new Error("AI response did not contain a valid JSON array. Please try again.");
    }

    raw = raw.slice(start, end + 1);

    let questions;
    try {
      questions = JSON.parse(raw);
    } catch {
      // Attempt trailing-comma fix
      try {
        const fixed = raw.replace(/,\s*([}\]])/g, "$1");
        questions = JSON.parse(fixed);
      } catch {
        throw new Error("Failed to parse AI response as valid JSON. Please try again.");
      }
    }

    if (!Array.isArray(questions)) {
      throw new Error("AI response was not a JSON array.");
    }

    // ── Sanitize and validate each question ───────────────────────────────────
    const seen   = new Set();
    const result = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.question || !Array.isArray(q.options) || !q.correct) {
        console.log(`Skipping question ${i}: missing required fields`);
        continue;
      }

      const questionText      = String(q.question).trim();
      const correctNormalized = String(q.correct).trim();
      const optionsNormalized = q.options.map(o => String(o).trim());

      if (seen.has(questionText)) {
        console.log(`Skipping question ${i}: duplicate`);
        continue;
      }

      const matchIndex = optionsNormalized.findIndex(opt => opt === correctNormalized);
      if (matchIndex === -1) {
        console.log(
          `Skipping question ${i}: correct answer "${correctNormalized}" not found in options`
        );
        continue;
      }

      seen.add(questionText);
      result.push({
        id:       result.length + 1,
        question: questionText,
        options:  optionsNormalized,
        correct:  correctNormalized
      });
    }

    console.log(`Valid questions: ${result.length} / ${questions.length}`);

    if (result.length === 0) {
      throw new Error(
        "No valid questions were generated. The AI response format may be incorrect. Please try again."
      );
    }

    res.json({
      success:    true,
      questions:  result,
      count:      result.length,
      difficulty: cleanDifficulty,
      chapterName: cleanChapter,
      subjectName: cleanSubject,
      createdAt:  new Date()
    });

  } catch (error) {
    console.error("❌ Mock generation error:", error.message);
    res.status(500).json({
      success: false,
      error:   error.message || "Failed to generate mock test"
    });
  }
});

export default router;