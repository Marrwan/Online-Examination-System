const  express = require("express"),
       { isLoggedIn, isAdmin, isStudent } = require("../auth/auth"),
       Students = require('../models/Students'),
       Course = require('../models/Courses');
var router = express.Router();
 

router.get("/", (req, res) => {
  res.render("welcome");
});
router.get("/logins", (req, res) => {
  res.render("index");
});

router.get("/dashboard", isLoggedIn,  (req, res) => {
  if(req.user.userType == 'admin'){
    Students.find({}, (err, users)=>{
      Course.find({}, (err, course) => {
        if (err) {
          console.log(err);
        } else {
          res.render('admindash', {users, course})
        }
      });
    })
  }else if(req.user.userType == 'student'){
res.render('studentdash')
  }
  
});


module.exports = router;
