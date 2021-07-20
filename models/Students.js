var mongoose = require("mongoose");
var Course = require("./Courses");
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
      ref: "Course",
    },
  ],
  userType: {
    type: String,
    default: "student",
  },
  class: {
    type: String,
    enum: ["JSS1", "JSS2", "JSS3", "SS1" , "SS2" , "SS3" , "Undergrad" , "Postgrad"],
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
});

module.exports = mongoose.model("Student", StudentSchema);
