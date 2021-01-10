var mongoose = require("mongoose");

module.exports = mongoose.model("Course", new mongoose.Schema({
    courseid: {
        type: String,
        unique: true,
        required: true
    },
    coursename: {
        type: String,
        unique: true,
        required: true
    },
    registered_students: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
      }
    ],
    exams: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam"
        }
    ]
}));