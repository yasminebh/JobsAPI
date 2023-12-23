require("dotenv").config();
const UserModel = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const user = new UserModel(req.body);
  console.log(user);
  await user.save();
  const token = user.createJWT();
  //res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
  res
    .status(StatusCodes.CREATED)
    .json({
      user: {
        email: user.email,
        lastName: user.lastName,
        location: user.location,
        name: user.name,
        token,
      },
    });
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
  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  });
};

const updateUser = async (req,res) =>{
  const {email, name, lastName, location} = req.body;
  console.log(req.user)
  if(!email || !name || !lastName || !location) {
    throw new BadRequestError("all fields must be filled ")
  }

  const user = await UserModel.findOne({_id: req.user.userId})

  user.email= email
  user.lastName = lastName
  user.name = name
  user.location = location
  await user.save()
  // we create new token because we use name in the payload which can be changed
  const token = user.createJWT()
  res
    .status(StatusCodes.CREATED)
    .json({
      user: {
        email: user.email,
        lastName: user.lastName,
        location: user.location,
        name: user.name,
        token,
      },
    });


}

module.exports = {
  register,
  login,
  updateUser
};
