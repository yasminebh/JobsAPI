const route = require('express').Router()

const  {
  createJob,
  getAllJobs,
  getOneJob,
  updateJob,
  deleteJob
}= require('../controllers/jobs')


route.post('/', createJob)
route.get('/', getAllJobs)
route.get('/:id', getOneJob)
route.patch('/:id', updateJob)
route.delete('/:id', deleteJob)
module.exports = route