const { Errors } = require("../utils/CustomError/Errors");

exports.errorHandler = (error, req, res, next) => {
  //   console.log("error cause: ", error.cause);
  //   console.log("error: ", error);
  switch (error.code) {
    case Errors.INVALID_TYPE_ERROR:
      return res.send({ status: "error", error: error.name });
      break;
    case Errors.DATABASE_ERROR:
      return res.send({ status: "error", error: error.name });
      break;
    case Errors.ROUTING_ERROR:
      return res.send({ status: "error", error: error.name });
      break;
    default:
      return res.send({ status: "error", error: "Unhandled error" });
      break;
  }
};
