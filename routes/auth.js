const route = require('express').Router()
const authenticateUser = require('../middleware/authentication')

const {login, register, updateUser} = require('../controllers/auth')


route.post('/login', login)
route.post('/register', register)
route.patch('/updateUser', authenticateUser, updateUser  )
module.exports = route