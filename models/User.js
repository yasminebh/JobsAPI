const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  jobs: [{ type: mongoose.Types.ObjectId, ref: "Job" }],
  name: {
    type: String,
    required: [true, "please provide a name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "please provide an email"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: 6,
  },
});

// UserSchema.pre("save", async function () {
//   const salt = await bcrypt.genSalt(10);
//   const hashpassword = await bcrypt.hash(this.password, salt);
//   this.password = hashpassword;
// });
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};
UserSchema.methods.checkPassword = async function (enteredPassword) {
  isCorrect = await bcrypt.compare(enteredPassword, this.password);
  return isCorrect;
};
module.exports = mongoose.model("User", UserSchema);
