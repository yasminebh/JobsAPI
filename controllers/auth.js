require("dotenv").config();
const UserModel = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

 
 
const register = async (req, res) => {
  const newUser = new UserModel(req.body);
  console.log(newUser);
  await newUser.save();
  const token = newUser.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: newUser.name }, token });
};

const login = async (req, res) => {
  const { email, password: enteredPassword } = req.body;
  if (!email || !enteredPassword) {
    throw new BadRequestError("enter your email and password");
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("invalid credentials ");
  }
  const isPasswordCorrect = await user.checkPassword(enteredPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("wrong password");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
