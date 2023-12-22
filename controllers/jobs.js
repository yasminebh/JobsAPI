const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { NotFoundError, BadRequestError } = require("../errors");

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const newJob = new Job(req.body);
  await newJob.save();
  /*   User.findByIdAndUpdate(newJob.createdBy, {
    $push: {
      jobs: newJob._id
    }
  }) */
  res.status(StatusCodes.OK).json({ newJob });
};
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs });
};
const getOneJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError("no job with id", jobId);
  }
  return res.status(StatusCodes.OK).json({ job });
};
const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;
  if (company === "" || position === "") {
    throw new BadRequestError("company or position field cannot be empty");
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true },
    { runValidators: true }
  );

  if (!job) {
    throw new NotFoundError("job not found");
  }

  res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const {user:{userId}, params:{id: jobId}}= req
  
  const jobDelete = await Job.findByIdAndDelete({_id: jobId, createdBy: userId})
  console.log("jobDelete" ,jobDelete)
 
  if(!jobDelete) {
    throw new NotFoundError("the job doesn't exist")
  }
  res.status(StatusCodes.OK).send()
};

module.exports = {
  createJob,
  getAllJobs,
  getOneJob,
  updateJob,
  deleteJob,
};
