import mongoose from "mongoose";

/* ======================
   Mock Test Schema
====================== */

const MockTestSchema = new mongoose.Schema({

  score: {
    type: Number,
    required: true
  },

  total: {
    type: Number,
    required: true
  }

}, { timestamps: true });



/* ======================
   Notes Schema
====================== */

const NoteSchema = new mongoose.Schema({

  content: {
    type: String,
    required: true
  }

}, { timestamps: true });



/* ======================
   AI Chat Schema
====================== */

const ChatSchema = new mongoose.Schema({

  question: {
    type: String,
    required: true
  },

  answer: {
    type: String,
    required: true
  }

}, { timestamps: true });



/* ======================
   Chapter Schema
====================== */

const ChapterSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  mockTests: [MockTestSchema],

  notes: [NoteSchema],

  assistantChats: [ChatSchema]

});



/* ======================
   Subject Schema
====================== */

const SubjectSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy"
  },

  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  chapters: [ChapterSchema]

}, { timestamps: true });



export default mongoose.model("Subject", SubjectSchema);