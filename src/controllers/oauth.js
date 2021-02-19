const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const SpotifyStrategy = require("passport-spotify").Strategy;
const mongoose = require("mongoose");
const UserSchema = require("../models/userModel");
const UserModel = mongoose.model("User", UserSchema);
const { authenticate } = require("./authTools");

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.CALLBACK_URL_GOOGLE,
    },
    async (request, accessToken, refreshToken, profile, next) => {
      const newUser = {
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        password: "NA",
      };

      try {
        const user = await UserModel.findOne({ googleId: profile.id });
        console.log(user);
        if (user) {
          const tokens = await authenticate(user);
          next(null, { user, tokens });
        } else {
          const createdUser = new UserModel(newUser);
          await createdUser.save();
          const tokens = await authenticate(createdUser);
          next(null, { user: createdUser, tokens });
        }
      } catch (error) {
        next(error);
      }
    }
  )
);

passport.use(
  "spotify",
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      callbackURL: process.env.CALLBACK_URL_SPOTIFY,
    },
    async (request, accessToken, refreshToken, profile, next) => {
      console.log(profile);
      const newUser = {
        spotifyId: profile.id,
        nickname: profile.display_name,
        email: profile.emails,
        password: "NA",
      };

      try {
        const user = await UserModel.findOne({ spotifyId: profile.id });

        if (user) {
          const tokens = await authenticate(user);
          next(null, { user, tokens });
        } else {
          const createdUser = new UserModel(newUser);
          await createdUser.save();
          const tokens = await authenticate(createdUser);
          next(null, { user: createdUser, tokens });
        }
      } catch (error) {
        next(error);
      }
    }
  )
);

passport.serializeUser(function (user, next) {
  next(null, user);
});
