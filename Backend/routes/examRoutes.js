import express from "express";
import Exam from "../models/Exam.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* Get all exams for user */
router.get("/", authMiddleware, async (req, res) => {

  const exams = await Exam.find({
    userId: req.user.userId
  });

  res.json(exams);

});

/* Create exam */
router.post("/", authMiddleware, async (req, res) => {

  const { examName, date, studyHours } = req.body;

  const exam = new Exam({
    examName,
    date,
    studyHours,
    userId: req.user.userId
  });

  await exam.save();

  res.json(exam);

});

/*Update*/

router.put("/:id", authMiddleware, async (req, res) => {

  try {

    const { examName, date, studyHours } = req.body;

    const updatedExam = await Exam.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId
      },
      {
        examName,
        date,
        studyHours
      },
      { new: true }
    );

    if (!updatedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json(updatedExam);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

/* Delete exam */
router.delete("/:id", authMiddleware, async (req, res) => {

  await Exam.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.userId
  });

  res.json({ message: "Exam deleted" });

});

export default router;