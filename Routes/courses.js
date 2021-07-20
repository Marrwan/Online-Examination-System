const express = require("express"),
  router = express.Router(),
  { isAdmin, isLoggedIn, isStudent } = require("../auth/auth"),
  Course = require("../models/Courses"),
  Exam = require('../models/Exam'),
  Question = require('../')
Students = require("../models/Students");

// Get all courses
router.get("/", isLoggedIn, (req, res) => {
  Course.find({}, (err, course) => {
    if (err) {
      console.log(err);
    } else {
      res.render("course/course", { course });
    }
  });
});

// Form to create new course
router.get("/new", isLoggedIn, isAdmin, (req, res) => {
  res.render("course/new");
});

// create new course
router.post("/new", isLoggedIn, isAdmin, (req, res) => {
  const { courseid, coursename } = req.body;
  let errors = [];
  //check required field
  if (!courseid || !coursename) {
    errors.push({ msg: "Please fill in all fields" });
  }
  //check password length
  if (coursename.length <= 3) {
    errors.push({ msg: "Coursename should be more than 3 characters" });
  }

  if (errors.length > 0) {
    res.render("course/new", {
      errors,
      courseid,
      coursename,
    });
  } else {
    Course.findOne({ coursename: coursename }).then((course) => {
      errors.push({ msg: `${coursename} is already registered` });
      if (course) {
        res.render("course/new", {
          errors,
          courseid,
          coursename,
        });
      } else {
        var NewCourse = new Course({
          coursename,
          courseid,
        });
        NewCourse.save()
          .then((course) => {
            req.flash("success_msg", `${course.coursename} has been created`);
            res.redirect("/dashboard");
          })
          .catch((err) => console.log(err));
      }
    });
  }
});

// show all registered course for a specific user
router.get("/registered", isLoggedIn, isStudent, (req, res) => {
  Students.findOne({ name: req.user.name })
    .populate("course_list")
    .exec((err, user) => {
      res.render("course/students_course", { user });
    });
});

// show number of students that registered for a specific course
router.get("/:id/registered_students", isLoggedIn, isAdmin, (req, res) => {
  Course.findById(req.params.id)
    .populate("registered_students")
    .exec((err, course) => {
      res.render("course/registered_students", { course });
    });
});

//SHOW ROUTE- get specific course
router.get("/:id", isLoggedIn, (req, res) => {
  Course.findById(req.params.id)
  .populate('exams')
  .exec((err,course)=>{
    Students.findOne({name: req.user.name})
    .populate('course_list')
    .exec((err, user)=>{
      res.render("course/show", { course, user });
    })
  })
});

// show form to edit course
router.get("/:id/edit", isLoggedIn, isAdmin, (req, res) => {
  Course.findById(req.params.id, (err, course) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("course/edit", { course });
    }
  });
});

// edit course handle
router.put("/:id", isLoggedIn, isAdmin, (req, res) => {
  // using just req.params.id in the first argument of Course.find.. only updates the first item everytime
  Course.findOneAndUpdate({ _id: req.params.id }, req.body, (err, updatedCourse) => {
    if (err) {
      res.redirect("/");
      console.log(err);
    } else {
      // res.redirect(`/courses/${req.params.id}`);
      const { courseid, coursename } = req.body;
      let errors = [];
      Course.findOne({ coursename: coursename }).then((course) => {
        //check required field
        if (!courseid || !coursename) {
          errors.push({ msg: "Please fill in all fields" });
        }
        //check password length
        if (coursename.length <= 3) {
          errors.push({ msg: "Coursename should be more than 3 characters" });
        }

        if (errors.length > 0) {
          res.render("course/edit", {
            errors,
            courseid,
            coursename,
            course,
          });
        } else {
          req.flash("success_msg", `Update Successfull`);
          res.redirect(`/courses/${req.params.id}`);
        }
      });
    }
  });
});

//delete a specific course
router.delete("/:id", async (req, res) => {
  Course.findByIdAndRemove(req.params.id, (err, deleted) => {
    if (err) {
      res.redirect("/courses");
      req.flash("error_msg", err);
      console.log(err);
    } else {
      req.flash("success_msg", `${deleted.coursename} deleted`);
      res.redirect("/courses");
    }
  });
});

// Course registeration handle for students
router.post("/:id/add", isLoggedIn, isStudent, (req, res) => {
  // console.log(req.user.name);
  Students.findOne({ name: req.user.name }, (err, user) => {
    if (err) throw err;
    Course.findById(req.params.id, (err, course) => {
      if (err) throw err;
      course.registered_students.push(user);
      course.save((err, course) => {
        if (err) throw err;
        user.course_list.push(course);
        user.save((err, data) => {
          if (err) throw err;
        });
      });
      req.flash("success_msg", `${course.coursename} registered successfully`);
      res.redirect(`/courses/registered`);
    });
  });
});

module.exports = router;
