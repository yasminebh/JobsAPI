require('dotenv').config()
const dbConnect = require('./db/dbConfig')

const mockData = require('./MOCK_DATA.json')

const Job = require('./models/Job')

const start = async () => {
  try {
    await dbConnect()
    await Job.create(mockData)
    console.log('sucesssssss ')
    process.exit(0)
    
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
start()
