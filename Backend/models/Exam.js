import mongoose from "mongoose";

const ExamSchema = new mongoose.Schema({

  examName: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  studyHours: {
    type: Number,
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

export default mongoose.model("Exam", ExamSchema);