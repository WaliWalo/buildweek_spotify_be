const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: { type: String, required: true },
    googleId: String,
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) return user;
    else return { error: "Username/password incorrect" };
  } else {
    return null;
  }
};

UserSchema.pre("save", async function (next) {
  const user = this;
  const plainPW = user.password;
  console.log(user);
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(plainPW, 10);
  }
  next();
});

module.exports = UserSchema;
