const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const auth = async (req,res,next)=> {
  //check header
  const authHeader = req.headers.authorization
  if(!authHeader || !authHeader.startsWith('Bearer ')){
    throw new UnauthenticatedError("authentication invalid")
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token , process.env.JWT_SECRET_KEY)
    //test if our user is demo user 
    const testUser = payload.userId==='658605c840177eb48f112414'
    // attach user to the job route
    req.user = { userId: payload.userId, testUser };

    next()
  } catch (error) {
    throw new UnauthenticatedError("authentication invalid")
  }
}

module.exports= auth