import express from "express";
import Subject from "../models/Subject.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ======================
   SUBJECT ROUTES
====================== */

// Get all subjects
router.get("/", authMiddleware, async (req, res) => {
  try {

    const subjects = await Subject.find({
      userId: req.user.userId
    });

    res.json(subjects);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }
});


// Create subject
router.post("/", authMiddleware, async (req, res) => {
  try {

    const subject = new Subject({
      ...req.body,
      userId: req.user.userId
    });

    await subject.save();

    res.json(subject);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }
});


// Update subject
router.put("/:subjectId", authMiddleware, async (req, res) => {
  try {

    const updated = await Subject.findOneAndUpdate(
      {
        _id: req.params.subjectId,
        userId: req.user.userId
      },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json(updated);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }
});


// Delete subject
router.delete("/:subjectId", authMiddleware, async (req, res) => {
  try {

    await Subject.findOneAndDelete({
      _id: req.params.subjectId,
      userId: req.user.userId
    });

    res.json({ message: "Subject deleted" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }
});


/* ======================
   CHAPTER ROUTES
====================== */

// Add chapter
router.post("/:subjectId/chapters", authMiddleware, async (req, res) => {
  try {

    const subject = await Subject.findOne({
      _id: req.params.subjectId,
      userId: req.user.userId
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const newChapter = {
      name: req.body.name,
      mockTests: [],
      notes: [],
      assistantChats: []
    };

    subject.chapters.push(newChapter);

    await subject.save();

    res.json(subject.chapters[subject.chapters.length - 1]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }
});


// Delete chapter
router.delete("/:subjectId/chapters/:chapterId", authMiddleware, async (req, res) => {
  try {

    const subject = await Subject.findOne({
      _id: req.params.subjectId,
      userId: req.user.userId
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    subject.chapters = subject.chapters.filter(
      ch => ch._id.toString() !== req.params.chapterId
    );

    await subject.save();

    res.json({ message: "Chapter deleted" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }
});


/* ======================
   NOTES ROUTES
====================== */

// Get notes
router.get("/:subjectId/chapters/:chapterId/notes", authMiddleware, async (req, res) => {
  try {

    const subject = await Subject.findOne({
      _id: req.params.subjectId,
      userId: req.user.userId
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const chapter = subject.chapters.id(req.params.chapterId);

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    res.json(chapter.notes || []);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }
});


// Add note
router.post("/:subjectId/chapters/:chapterId/notes", authMiddleware, async (req, res) => {
  try {

    const subject = await Subject.findOne({
      _id: req.params.subjectId,
      userId: req.user.userId
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const chapter = subject.chapters.id(req.params.chapterId);

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    const newNote = {
      content: req.body.content,
      createdAt: new Date()
    };

    chapter.notes.push(newNote);

    await subject.save();

    res.json(chapter.notes[chapter.notes.length - 1]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }
});


// Delete note
router.delete("/:subjectId/chapters/:chapterId/notes/:noteId", authMiddleware, async (req, res) => {
  try {

    const subject = await Subject.findOne({
      _id: req.params.subjectId,
      userId: req.user.userId
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const chapter = subject.chapters.id(req.params.chapterId);

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    chapter.notes = chapter.notes.filter(
      note => note._id.toString() !== req.params.noteId
    );

    await subject.save();

    res.json({ message: "Note deleted" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }
});


/* ======================
   MOCK TEST ROUTES
====================== */

router.post("/:subjectId/chapters/:chapterId/mocktests", authMiddleware, async (req, res) => {
  try {

    const subject = await Subject.findOne({
      _id: req.params.subjectId,
      userId: req.user.userId
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const chapter = subject.chapters.id(req.params.chapterId);

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    const newTest = {
      score: req.body.score,
      total: req.body.total,
      createdAt: new Date()
    };

    chapter.mockTests.push(newTest);

    await subject.save();

    res.json(chapter.mockTests[chapter.mockTests.length - 1]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }
});


/* ======================
   AI CHAT ROUTES
====================== */

// Get chats
router.get("/:subjectId/chapters/:chapterId/chats", authMiddleware, async (req, res) => {
  try {

    const subject = await Subject.findOne({
      _id: req.params.subjectId,
      userId: req.user.userId
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const chapter = subject.chapters.id(req.params.chapterId);

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    res.json(chapter.assistantChats || []);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }
});


// Save chat
router.post("/:subjectId/chapters/:chapterId/chats", authMiddleware, async (req, res) => {
  try {

    const subject = await Subject.findOne({
      _id: req.params.subjectId,
      userId: req.user.userId
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const chapter = subject.chapters.id(req.params.chapterId);

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    const newChat = {
      question: req.body.question,
      answer: req.body.answer,
      createdAt: new Date()
    };

    chapter.assistantChats.push(newChat);

    await subject.save();

    res.json(chapter.assistantChats[chapter.assistantChats.length - 1]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: error.message });

  }
});


export default router;