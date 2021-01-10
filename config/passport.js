const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


//Model
const Admin = require('../models/Admin');
const Students = require('../models/Students');


module.exports = function (passport) {
    passport.use(
        "local-login-admin",
      new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        //Match User
        Admin.findOne({ email: email })
          .then((admin) => {
            if (!admin) {
              return done(null, false, {
                message: "That email is not registered",
              });
            } 
            //Match password
            bcrypt.compare(password, admin.password, (err, isMatch) => {
              if (err) throw err;
  
              if (isMatch) {
                return done(null, admin);
              } else {
                return done(null, false, { message: "Password Incorrect" });
              }
            });
          })
          .catch((err) => console.log(err));
      })
    );
    passport.use(
        "local-login-student",
      new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        //Match User
        Students.findOne({ email: email })
          .then((student) => {
            if (!student) {
              return done(null, false, {
                message: "That email is not registered",
              });
            }
            //Match password
            bcrypt.compare(password, student.password, (err, isMatch) => {
              if (err) throw err;
  
              if (isMatch) {
                return done(null, student);
              } else {
                return done(null, false, { message: "Password Incorrect" });
              }
            });
          })
          .catch((err) => console.log(err));
      })
    );
    passport.serializeUser(function (user, done) {
        done(null, JSON.stringify(user));
      });
    passport.deserializeUser(function (user, done) {
        done(null, JSON.parse(user));
      });
  };
  