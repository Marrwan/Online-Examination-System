const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const Students = require("./models/Students");
const bcrypt = require("bcryptjs");
var admin = {
  name: "GadgAcademia",
  email: "gadgacademia@gmail.com",
  password: "gadgacademia.com",
};

var students = [
  { name: "Abdulbasit Alabi", email: "Abdul@gmail.com", password: "1234567" },
  { name: "Tope Alabi", email: "Tope@gmail.com", password: "1234567" },
  { name: "Maryam Audu", email: "Maryam@gmail.com", password: "1234567" },
];

function seedDB() {
  Admin.findOne({ email: admin.email }).then((user) => {
    //User exist
    if (user) {
      console.log(` ${admin.email}   is already registered
            admin email: ${admin.email} 
            admin password: ${admin.password} 
======================================================== `);
    } else {
      var newAdmin = new Admin(admin);

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
          if (err) throw err;
          // set password to hashed
          newAdmin.password = hash;

          newAdmin.save((err, newadmin) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`Admin added successfully
                admin email: ${admin.email} 
                admin password: ${admin.password} `);
              console.log("============================");
              // console.log(newadmin)
            }
          });
        });
      });
    }
  });
  students.forEach((student) => {
    Students.findOne({ email: student.email }).then((user) => {
      //User exist
      if (user) {
        console.log(` ${student.email}   is already registered
            student email: ${student.email} 
            student password: ${student.password} 
======================================================== `);
      } else {
        var newStudent = new Students(student);

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newStudent.password, salt, (err, hash) => {
            if (err) throw err;
            // set password to hashed
            newStudent.password = hash;

            newStudent.save((err, newstudent) => {
              if (err) {
                console.log(err);
              } else {
                console.log(`Student added successfully
                    student email: ${student.email} 
                    student password: ${student.password} `);
                console.log("=======================================");
                // console.log(newstudent)
              }
            });
          });
        });
      }
    });
  });
}

module.exports = seedDB;
