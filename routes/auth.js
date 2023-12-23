const route = require('express').Router()
const authenticateUser = require('../middleware/authentication')
const testUser = require('../middleware/testUser')

//limiting  the rate of login and register from the same IP address to avoid spams

const rateLimiter = require('express-rate-limit')

const apiLimiter = rateLimiter ({
  windowMs: 15*60*1000, //15min
  max:10,
  message: {
    msg: "too many requests from the same API please try again after 15 minutes"
  }
})

const {login, register, updateUser} = require('../controllers/auth')


route.post('/login', apiLimiter, login)
route.post('/register',apiLimiter, register)

route.patch('/updateUser', authenticateUser, testUser, updateUser  )
module.exports = route