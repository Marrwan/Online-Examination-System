const express = require("express");
expressLayouts = require("express-ejs-layouts");
path = require("path");
mongoose = require("mongoose");
passport = require("passport");
flash = require("connect-flash");
session = require("express-session");
methodOverride = require("method-override");
_ = require("lodash");
array = require("lodash/array");
seedDB = require("./seeds");
var app = express();

//seeds data into the database
seedDB();
//database
const db = require("./config/keys").mongoURI;

// passport config
require("./config/passport")(passport);

//mongoose connection
mongoose
  .connect(db, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected succesfully"))
  .catch((err) => console.log(err));

// app.use(cors);
//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
// flash
app.use(flash());
//BodyParser
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
//public
app.use(express.static(path.join(__dirname, "public")));
// Express session
app.use(
  session({
    secret: "Abdulbasit",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());
//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.User = req.user;
  // req.session.lastAccess = new Date().getTime();
  next();
});

//Routes
app.use(require("./Routes/index"));
app.use(require("./Routes/user"));
app.use(require("./Routes/signup"));
app.use("/courses", require("./Routes/courses"));
app.use("/question", require("./Routes/question"));
app.use("/exam", require("./Routes/exam"));

app.listen("3000", () => console.log(`listening at https://localhost:3000`));
