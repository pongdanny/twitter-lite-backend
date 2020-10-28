const { check, validationResult } = require("express-validator");


function handleValidationErrors(req, res, next) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array().map((error) => error.msg);
      const err = Error("Bad request.");
      err.errors = errors;
      err.status = 400;
      err.title = "Bad request.";
      next(err);
    } else next();
  }

  const asyncHandler = (handler) => (req, res, next) =>
  handler(req, res, next).catch((e) => next(e));

  module.exports = {handleValidationErrors, asyncHandler, validationResult, check};
