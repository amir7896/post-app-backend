const { check, validationResult } = require("express-validator");
const { STATUS_CODE, ERRORS } = require("../../constants");
exports.validPost = [
  check("title")
    .notEmpty()
    .withMessage(ERRORS.REQUIRED.POST_TITLE)
    .isString()
    .withMessage(ERRORS.REQUIRED.MUST_STRING),
  check("content")
    .notEmpty()
    .withMessage(ERRORS.REQUIRED.POST_CONTENT)
    .isString()
    .withMessage(ERRORS.REQUIRED.MUST_STRING),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ success: false, message: errorMessages[0] });
    }
    next();
  },
];
