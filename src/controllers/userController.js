const mongoose = require("mongoose");
const UserSchema = require("../models/userModel");
const User = mongoose.model("User", UserSchema);
const { authenticate } = require("./authTools");

const getUsers = async (req, res, next) => {
  const user = await User.find({});
  if (user.length !== 0) {
    res.status(200).send(user);
  } else {
    let error = new Error();
    error.httpStatusCode = 404;
    next(error);
  }
};

const addNewUser = async (req, res, next) => {
  try {
    let newUser = new User(req.body);
    let user = await newUser.save();
    console.log("test", user);
    res.status(201).send(user);
  } catch (error) {
    error.httpStatusCode = 400;
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    console.log(user);
    if (user === null) {
      res.status(404).send({ error: "user not found" });
    } else if (user.error) {
      res.status(403).send(user);
    } else {
      const token = await authenticate(user);
      console.log(token.token);
      res
        .status(201)
        .cookie("accessToken", token.token, {
          httpOnly: false,
        })
        .send({ status: "ok" });
      // res.status(200).redirect(process.env.FE_URL);
      // res.status(201).send({ status: "ok" });
    }
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.send();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const googleAuthenticate = async (req, res, next) => {
  try {
    res.cookie("accessToken", req.user.tokens.token, {
      httpOnly: false,
    });

    res.status(200).redirect(process.env.FE_URL);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  addNewUser,
  login,
  logout,
  googleAuthenticate,
};
