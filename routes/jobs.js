const route = require('express').Router()
const testUser = require('../middleware/testUser')

const  {
  createJob,
  getAllJobs,
  getOneJob,
  updateJob,
  deleteJob
}= require('../controllers/jobs')


route.post('/',testUser, createJob)
route.get('/', getAllJobs)
route.get('/:id', getOneJob)
route.patch('/:id', testUser,  updateJob)
route.delete('/:id',testUser, deleteJob)
module.exports = route