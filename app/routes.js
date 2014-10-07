var User = require('./models/UserRest');

module.exports = function(app, _, io, participants, passport) {
  var user_controller = require('./controllers/user')(_, io, participants, passport, refreshAllUsers);
  var people_controller = require('./controllers/people')(_, io, participants, passport);

  app.get("/", user_controller.getJoinCommunity);
  app.get("/joinCommunity", user_controller.getJoinCommunity);
  app.post("/joinCommunity", user_controller.postJoinCommunity);

  app.get("/WelcomePage", isLoggedIn, user_controller.getWelcomePage);
  
  app.get("/people1", isLoggedIn, user_controller.getPeoplePage);
  app.get("/poster", isLoggedIn, function(req, res){
    res.render("poster");
  });
  app.get("/logout", isLoggedIn, user_controller.getLogout);
  
  app.post("/status", user_controller.postPeoplePage);

  // deprecated routes
  app.post("/signup", isLoggedIn, user_controller.postSignup);
  app.get("/welcome", isLoggedIn, user_controller.getWelcome);
  app.get("/people", isLoggedIn, people_controller.getPeople);
  app.get("/user", isLoggedIn, user_controller.getUser);
  app.get('/signup', user_controller.getSignup);
  app.post("/login", passport.authenticate('local-login', {
    successRedirect : '/people',
    failureRedirect : '/',
    failureFlash: true
  }));

};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}

function refreshAllUsers(participants, callback) {
  participants.all = [];
  User.getAllUsers(function(err, users) {
    users.forEach(function(user) {
      participants.all.push({'userName' : user.local.name});
    });
    callback();
  });
}
