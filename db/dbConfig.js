const mongoose = require('mongoose')
require('dotenv').config()

const dbConnect = async() => {
 try {
   await mongoose.connect(process.env.URL)
  console.log("db connected")
} catch (error) {
  console.log("db failed ")
  
 }
}

module.exports = dbConnect