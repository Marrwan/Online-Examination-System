const express = require("express"),
  router = express.Router(),
  { isAdmin, isLoggedIn, isStudent } = require("../auth/auth"),
  Course = require("../models/Courses"),
  Question = require("../models/Question"),
  Exam = require("../models/Exam");
Students = require("../models/Students");

//CREATE ROUTE- show form to add new question
router.get("/:id/new", isLoggedIn, isAdmin, (req, res) => {
  Exam.findById(req.params.id, (err, exam) => {
    res.render("question/new", { exam });
  });
});

//new question handle
router.post("/:id/new", isLoggedIn, isAdmin, (req, res) => {
  const {
    question_code,
    question,
    optionA,
    optionB,
    optionC,
    Answer,
  } = req.body;
  let errors = [];
  //check required field
  if (!question || !optionA || !optionB || !optionC || !Answer) {
    errors.push({ msg: "Please fill in all fields" });
  }
  if (errors.length > 0) {
    res.render("question/new", {
      errors,
      question_code,
      question,
      optionA,
      optionB,
      optionC,
      Answer,
    });
  } else {
    Exam.findById(req.params.id)
      .populate("questions")
      .exec((err, exam) => {
        Question.findOne({ question }).then((data) => {
          errors.push({
            msg: `There is an exact question like this, change your question`,
          });
          if (data) {
            res.render("question/new", {
              errors,
              question_code,
              question,
              optionA,
              optionB,
              optionC,
              Answer,
            });
          } else {
            var newQuestion = new Question({
              question,
              question_code,
              optionA,
              optionB,
              optionC,
              Answer,
            });

            newQuestion.save((err, question) => {
              if (err) throw err;
              exam.questions.push(question);
              exam.save((err, exam) => {
                Exam.findOne(
                  { exam_code: exam.exam_code },
                  (err, foundExam) => {
                    if (foundExam.questions.length == 1) {
                      req.flash(
                        "success_msg",
                        `Question added successfully, ${foundExam.exam_code} now has ${foundExam.questions.length} question`
                      );
                    } else {
                      req.flash(
                        "success_msg",
                        `Question added successfully,  ${foundExam.exam_code} now has ${foundExam.questions.length} questions`
                      );
                    }
                    res.redirect(`/question/${req.params.id}/new`);
                  }
                );
              });
            });
          }
        });
      });
  }
});

// SHOW ROUTE - show a specific question
router.get("/:Cid/:Eid/:Qid", isLoggedIn, isAdmin, (req, res) => {
  Course.findById(req.params.Cid, (err, course) => {
    Exam.findById(req.params.Eid, (err, exam) => {
      Question.findById(req.params.Qid, (err, question) => {
        res.render("question/show", { course, exam, question });
      });
    });
  });
});

// DELETE ROUTE- delete a specific question
router.delete("/:Cid/:Eid/:Qid", isLoggedIn, isAdmin, async function(req, res){
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.Eid, {$pull : {questions: req.params.Qid},},{new: true});
    if(!exam){
      return res.status(400).send('Exam not found')
    }
    await Question.findByIdAndDelete(req.params.Qid)
    req.flash("success_msg", `Question deleted`);
          res.redirect(`/exam/${req.params.Cid}/${req.params.Eid}`);
  }catch(err){
    console.log(err);
    res.status(500).send("Something went wrong");
  }
  // Exam.findById(req.params.Eid)
  //   .populate("questions")
  //   .exec((err, exam) => {
  //     Question.findByIdAndRemove(req.params.Qid, (err, question) => {
  //       if (err) throw err;
  //       _.remove(exam.questions, (question) => {
  //         return question._id == req.params.Qid;
  //       });
  //       exam.save((err, exam) => {
  //         console.log(exam);
  //         req.flash("success_msg", `Question deleted`);
  //         res.redirect(`/exam/${req.params.Cid}/${req.params.Eid}`);
  //       });
  //     });
  //   });
});

//  UPDATE ROUTE- Show form to edit question
router.get("/:Cid/:Eid/:Qid/edit", isLoggedIn, isAdmin, (req, res) => {
  Course.findById(req.params.Cid, (err, course) => {
    Exam.findById(req.params.Eid, (err, exam) => {
      Question.findById(req.params.Qid, (err, questions) => {
        res.render("question/edit", { course, exam, questions });
      });
    });
  });
});

// Update handle
router.put("/:Cid/:Eid/:Qid/edit", isLoggedIn, isAdmin, (req, res) => {
  Course.findById(req.params.Cid, (err, course) => {
    Exam.findById(req.params.Eid, (err, exam) => {
      if (err) throw err;
      Question.findByIdAndUpdate(req.params.Qid, req.body, (err, questions) => {
        if (err) {
          req.flash("error_msg", err);
          res.redirect(
            `/question/${req.params.Cid}/${req.params.Eid}/${req.params.Qid}edit`
          );
        } else {
          const {
            question_code,
            question,
            optionA,
            optionB,
            optionC,
            Answer,
          } = req.body;
          let errors = [];
          //check required field
          if (!question || !optionA || !optionB || !optionC || !Answer) {
            errors.push({ msg: "Please fill in all fields" });
          }
          if (errors.length > 0) {
            res.render("question/edit", {
              course,
              exam,
              questions,
              errors,
              question_code,
              question,
              optionA,
              optionB,
              optionC,
              Answer,
            });
          } else {
            req.flash("success_msg", `Update Successfull`);
            res.redirect(
              `/question/${req.params.Cid}/${req.params.Eid}/${req.params.Qid}`
            );
          }
        }
      });
    });
  });
});
module.exports = router;
