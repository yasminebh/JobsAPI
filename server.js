const express = require('express')
const dbConnect = require('./db/dbConfig')
require('express-async-errors')

require('dotenv').config()

const path = require('path')
//extra security packages 


const helmet = require('helmet')
const app = express()

app.set('trust proxy', 1)
app.use(express.static(path.resolve(__dirname,'./client/build')))
app.use(helmet())

app.use(express.json())


//auth middleware
const auth = require('./middleware/authentication')
//importing routes 
const authRoute = require('./routes/auth')
const jobRoute = require('./routes/jobs')

//setting routes 
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/jobs',auth ,jobRoute)


app.get('*', (req,res) => {
  res.sendFile(path.resolve(__dirname,'./client/build', 'index.html'))
})

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

