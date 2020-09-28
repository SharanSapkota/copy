const { check, validationResult } = require("express-validator");

exports.userValidationResult = (req, res, next) => {
  const result = validationResult(req);
  console.log(result);
  if (!result.isEmpty()) {
    console.log("erro");
    const error = result.array()[0].msg;
    return res.status(400).json({ success: false, error: error });
  }
  next();
};

exports.userValidator = [
  check("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("username is required"),

  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({ min: 5 })
    .withMessage("Password too short"),

  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  check("phone_number")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Phone number is required")
];
