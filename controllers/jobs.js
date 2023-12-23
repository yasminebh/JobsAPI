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
  const { search, status, jobType, sort } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  let result = Job.find(queryObject);
  //sorting

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  // fresher : Math.ceil , rounds the value and returns greater than or equal to a given number.
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
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
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const jobDelete = await Job.findByIdAndDelete({
    _id: jobId,
    createdBy: userId,
  });
  console.log("jobDelete", jobDelete);

  if (!jobDelete) {
    throw new NotFoundError("the job doesn't exist");
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  createJob,
  getAllJobs,
  getOneJob,
  updateJob,
  deleteJob,
};
