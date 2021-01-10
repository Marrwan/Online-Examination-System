var mongoose = require("mongoose");

var AdminSchema = new mongoose.Schema({
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
  userType: { type: String, default: "admin" },
});

module.exports = mongoose.model("Admin", AdminSchema);
