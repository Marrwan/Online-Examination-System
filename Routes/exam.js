const { actionErrorHandler } = require("admin-bro");

const express = require("express"),
  router = express.Router(),
  { isAdmin, isLoggedIn, isStudent } = require("../auth/auth"),
  Exam = require("../models/Exam"),
  Course = require("../models/Courses"),
  Question = require("../models/Question"),
  Students = require("../models/Students");

// CREATE ROUTE - show form to create new exam
router.get("/:id/new", isLoggedIn, isAdmin, (req, res) => {
  Course.findById(req.params.id).then((course) => {
    res.render("exam/new", { course });
  });
});

// Handle create exam
router.post("/:id/new", isLoggedIn, isAdmin, (req, res) => {
  Course.findById(req.params.id).then((course) => {
    const {
      exam_code,
      instruction1,
      instruction2,
      instruction3,
      instruction4,
      instruction5,
      duration_hours,
      duration_minutes,
    } = req.body;
    let errors = [];
    //check required field
    if (!exam_code || !duration_hours || !duration_minutes) {
      errors.push({ msg: "Please fill in required fields" });
    }
    if (errors.length > 0) {
      res.render("exam/new", {
        errors,
        course,
        exam_code,
        instruction1,
        instruction2,
        instruction3,
        instruction4,
        instruction5,
        duration_hours,
        duration_minutes,
      });
    } else {
      Exam.findOne({ exam_code: exam_code }, (err, exam) => {
        if (exam) {
          errors.push({
            msg: `An exam with the exam code ${exam.exam_code} exist`,
          });
          res.render("exam/new", {
            errors,
            course,
            exam_code,
            instruction1,
            instruction2,
            instruction3,
            instruction4,
            instruction5,
            duration_hours,
            duration_minutes,
          });
        } else {
          const newExam = new Exam({
            exam_code,
            instruction1,
            instruction2,
            instruction3,
            instruction4,
            instruction5,
            duration_hours,
            duration_minutes,
          });
          newExam.save((err, savedExam) => {
            if (err) throw err;
            course.exams.push(savedExam);
            course.save((err, course) => {
              Exam.find({}, (err, exams) => {
                if (exams.length == 1) {
                  req.flash(
                    "success_msg",
                    `Exam added successfully, ${course.coursename}  now has ${exams.length} exam`
                  );
                } else {
                  req.flash(
                    "success_msg",
                    `Exam added successfully, ${course.coursename}  now has ${exams.length} exams`
                  );
                }
                res.redirect(`/courses/${req.params.id}`);
              });
            });
          });
        }
      });
    }
  });
});

//UPDATE ROUTE - Show form to edit exam
router.get("/:Cid/:Eid/edit", isLoggedIn, isAdmin, (req, res) => {
  Course.findById(req.params.Cid, (err, course) => {
    if (err) throw err;
    Exam.findById(req.params.Eid, (err, exam) => {
      if (err) {
        res.redirect(`/exam/${req.params.id}`);
      } else {
        res.json(exam.questions)
        // res.render("exam/edit", { exam, course });
      }
    });
  });
});

// HANDLE UPDATE ROUTE
router.put("/:Cid/:Eid/edit", isLoggedIn, isAdmin, (req, res) => {
  Course.findById(req.params.Cid, (err, course) => {
    if (err) throw err;
    Exam.findByIdAndUpdate(req.params.Eid, req.body, (err, exam) => {
      if (err) {
        req.flash("error_msg", err);
        res.redirect(`/exam/${req.params.Cid}/${req.params.Eid}/edit`);
      } else {
        const {
          exam_code,
          instruction1,
          instruction2,
          instruction3,
          instruction4,
          instruction5,
          duration_hours,
          duration_minutes,
        } = req.body;
        let errors = [];
        //check required field
        if (!exam_code || !duration_hours || !duration_minutes) {
          errors.push({ msg: "Please fill in all fields" });
        }
        if (errors.length > 0) {
          res.render("exam/edit", {
            errors,
            course,
            exam,
            exam_code,
            instruction1,
            instruction2,
            instruction3,
            instruction4,
            instruction5,
            duration_hours,
            duration_minutes,
          });
        } else {
          req.flash("success_msg", `Update Successfull`);
          res.redirect(`/exam/${req.params.Cid}/${req.params.Eid}`);
        }
      }
    });
  });
});

// SHOW ROUTE- show a specific exam
router.get("/:Cid/:Eid", isLoggedIn, (req, res) => {
  Course.findById(req.params.Cid, (err, course) => {
    if (err) throw err;
    Exam.findById(req.params.Eid)
      .populate("questions")
      .exec((err, exam) => {
        if (err) throw err;
        res.render("exam/show", { exam, course });
      });
  });
});

// DELETE ROUTE- delete a specific exam
router.delete("/:Cid/:Eid", isLoggedIn, isAdmin, (req, res) => {
  Course.findById(req.params.Cid, (err, course) => {
    if (err) throw err;
    Exam.findByIdAndRemove(req.params.Eid, (err, deleted) => {
      if (err) throw err;
      Question.deleteMany(
        { question_code: deleted.exam_code },
        (err, deletedQuestion) => {
          req.flash("success_msg", `${deleted.exam_code} deleted`);
          res.redirect(`/courses/${req.params.Cid}`);
        }
      );
    });
  });
});

// GET Route - get page to dispay exam for students to take
router.get("/:Cid/:Eid/exam", (req, res) => {
  Course.findById(req.params.Cid, (err, course) => {
    Exam.findById(req.params.Eid)
      .populate("questions")
      .exec((err, exam) => {
        res.render("exam/takeExam", { course, exam });
        // res.json(exam.questions)
      });
  });
});
router.get("/:Cid/:Eid/exam/exam", (req, res) => {
  Course.findById(req.params.Cid, (err, course) => {
    Exam.findById(req.params.Eid)
      .populate("questions")
      .exec((err, exam) => {
        // res.render("exam/takeExam", { course, exam });
        res.json(exam.questions)
      });
  });
});
module.exports = router;
