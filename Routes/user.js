const express = require("express"),
       router = express.Router(),
       {isAdmin, isLoggedIn} = require('../auth/auth'),
       passport = require('passport');
//models
var Admin = require("../models/Admin");
var Students = require("../models/Students");

router.get("/login", (req, res) => {
  var usertype = req.query.usertype;
  res.render('login',{method: usertype})
});
router.post('/login/:method', (req,res,next)=>{
  var method = req.params.method;
  if(method == "admin"){
    passport.authenticate("local-login-admin", {
      successRedirect: "/dashboard",
      failureRedirect: "/login?usertype=admin",
      failureFlash: true,
    })(req, res, next);
  }else if(method == "student"){
    passport.authenticate("local-login-student", {
      successRedirect: "/dashboard",
      failureRedirect: "/login?usertype=student",
      failureFlash: true,
    })(req, res, next);
  }

})

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

 
module.exports = router;
