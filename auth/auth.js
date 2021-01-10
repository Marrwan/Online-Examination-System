module.exports = {
  isLoggedIn: function (req, res, next) {

    if (req.isAuthenticated()) {
        // if user is authenticated in the session, carry on
      return next();
    }
    req.flash("error_msg", "You have to log in to view that");
       // if they aren't redirect them to the home page
       res.redirect("/logins");
  },
  isAdmin: function (req, res, next) {
      if (req.isAuthenticated() && req.user.userType == "admin") {
        // if user is authenticated in the session, carry on
      return next();
    }
    req.flash("error_msg", "Sorry!, This view is only for the admin");
    // if they aren't redirect them to the home page
    res.redirect("/logins");
  },
  isStudent: function(req, res, next) {

      if (req.isAuthenticated()&& req.user.userType =='student')
      // if user is authenticated in the session, carry on 
        return next();
        req.flash("error_msg", "Sorry!, This function is only for the students");
    // if they aren't redirect them to the home page
    res.redirect('/logins');
}
};
