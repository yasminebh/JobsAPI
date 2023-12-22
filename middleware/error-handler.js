// const {CustomApiError} = require("../errors");

const {StatusCodes} = require('http-status-codes')

/* const errorHandlerMiddleware = (err, req, res ,next) => {
  console.log('Error received:', err);

  if (err instanceof CustomApiError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
} */
const errorHandlerMiddleware = (err, req, res ,next) => {
  let customError = {
    //set default 
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || "something went wrong"

  }

  // if (err instanceof CustomApiError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }
  if(err.name === "CastError") {
    customError.msg= `no item found with id ${err.value}`
    customError.statusCode = 404
  }

if (err.name === 'ValidationError'){
  console.log(Object.values(err.errors));
  customError.msg= Object.values(err.errors).map((item)=> item.message).join(',')
  customError.statusCode=400
}
  if(err.code && err.code === 11000) {
    customError.msg = `duplicate value entered for  ${Object.keys(err.keyValue)}, field please choose another value`
    customError.statusCode= 404
  }

  // this first return gets us a long json of errors 
  // based on it we can access the key and property // of the error
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
}
module.exports = errorHandlerMiddleware