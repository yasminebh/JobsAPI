const {CustomApiError} = require("../errors/custom-api");

const {StatusCodes} = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res ,next) => {
  if (err instanceof CustomApiError) {
    return res.status(err.StatusCodes).json({msg: err.msg})
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
}
module.exports = errorHandlerMiddleware