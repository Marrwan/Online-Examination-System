var mongoose = require("mongoose");
var Course = require('./Courses');
var StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  course_list: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }
],
  userType: { type: String, default: "student" },
});

module.exports = mongoose.model("Student", StudentSchema);
