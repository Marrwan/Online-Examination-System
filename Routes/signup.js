var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
//models
var Admin = require("../models/Admin");
var Students = require("../models/Students");

router.post("/signup", (req, res) => {
  const { name, email, password, password2 } = req.body;
  // change the Students to Admin in order to signup as an Admin
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  //passwords match
  if (password !== password2) {
    errors.push({ msg: "Password do not match" });
  }

  //check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("signup", {
      errors,
      name,
      password,
      password2,
      email,
    });
  } else {
    // Validation pass
    Students.findOne({ email: email }).then((user) => {
      //User exist
      errors.push({ msg: "Email is already register" });
      if (user) {
        res.render("signup", {
          errors,
          name,
          password,
          password2,
          email,
        });
      } else {
        const newStudent = new Students({
          name,
          email,
          password,
        });
        // Hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newStudent.password, salt, (err, hash) => {
            if (err) throw err;
            // set password to hashed
            newStudent.password = hash;

            newStudent
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/logins");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

router.get("/signup", (req, res) => {
  res.render("signup");
});
module.exports = router;
