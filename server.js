const express = require('express')
const dbConnect = require('./db/dbConfig')
require('dotenv').config()
const app = express()


app.use(express.json())



const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware
  )

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

