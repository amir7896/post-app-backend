const { check, validationResult } = require("express-validator");
const { STATUS_CODE, ERRORS } = require("../../constants"); // Assuming you import your constants including REQUIRED

exports.validCar = [
  check("carModel")
    .notEmpty()
    .withMessage(ERRORS.REQUIRED.CAR_MODEL)
    .isString()
    .withMessage(ERRORS.REQUIRED.MUST_STRING),
  check("price")
    .notEmpty()
    .withMessage(ERRORS.REQUIRED.CAR_PRICE)
    .isNumeric()
    .withMessage(ERRORS.REQUIRED.PRICE_MUST_NUMBER),
  check("phoneNumber")
    .notEmpty()
    .withMessage(ERRORS.REQUIRED.PHONE_NO)
    .isString()
    .withMessage(ERRORS.REQUIRED.MUST_STRING)
    .isLength({ min: 11, max: 11 })
    .withMessage(ERRORS.REQUIRED.PHONE_LIMIT),
  check("city")
    .notEmpty()
    .withMessage(ERRORS.REQUIRED.CITY)
    .isString()
    .withMessage(ERRORS.REQUIRED.MUST_STRING),
  check("maxPictures")
    .notEmpty()
    .withMessage(ERRORS.REQUIRED.MAX_PICTURES)
    .isInt({ min: 1, max: 10 })
    .withMessage(ERRORS.REQUIRED.MAX_PICTURES_LIMIT),
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
