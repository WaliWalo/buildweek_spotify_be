const {
  getUsers,
  addNewUser,
  login,
  logout,
  googleAuthenticate,
} = require("../controllers/userController");
const { authorize } = require("../controllers/authMiddleware");
const passport = require("passport");

const routes = (app) => {
  app.route("/users").get(authorize, getUsers);
  app.route("/users/register").post(addNewUser);
  app.route("/users/login").post(login);
  app.route("/users/logout").post(logout);
  app
    .route("/users/googleLogin")
    .get(passport.authenticate("google", { scope: ["profile", "email"] }));
  app
    .route("/users/googleRedirect")
    .get(passport.authenticate("google"), googleAuthenticate);
};

module.exports = routes;
