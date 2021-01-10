var mongoose = require("mongoose");

var QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    unique: true,
  },
  optionA: {
    type: String,
    required: true,
  },
  optionB: {
    type: String,
    required: true,
  },
  optionC: {
    type: String,
    required: true,
  },
  question_code:{
    type: String,
    required: true,
  },
  Answer: {
    type: String,
    enum: ["A", "B", "C"],
    required: true,
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
