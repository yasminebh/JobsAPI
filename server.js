const express = require('express')
const dbConnect = require('./db/dbConfig')
require('express-async-errors')

require('dotenv').config()

//extra security packages 

const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss')
const rateLimiter = require('express-rate-limit')

const app = express()

app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs: 15*60*1000, //15min
  max:100,}
))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())



//auth middleware
const auth = require('./middleware/authentication')
//importing routes 
const authRoute = require('./routes/auth')
const jobRoute = require('./routes/jobs')

//setting routes 
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/jobs',auth ,jobRoute)


//error middlewares
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
 
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

PORT = process.env.PORT

const start = async () => {
  try {
    await dbConnect()
    app.listen(PORT, ()=> {
      console.log(`app is listening on PORT ${PORT}`)
    } )
    
  } catch (error) {
    console.log(error)
  }
}
start()

