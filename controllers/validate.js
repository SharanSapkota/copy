const { body } = require("express-validator");

const validate = method => {
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth();
  let day = d.getDate();
  let cA = new Date(year - 18, month, day).toDateString();
  let cB = new Date(year - 65, month, day).toDateString();

  switch (method) {
    case "createUserStep1": {
      return [
        body("username", "Username is required.")
          .exists()
          .isLength({ max: 25 }),
        body("password", "Password must be more than 6 characters.")
          .exists()
          .isLength({ min: 6, max: 25 }),
        body("email", "Email is invalid. Please try again.")
          .exists()
          .normalizeEmail()
          .isEmail(),
        body(
          "phone",
          "Your phone number doesn't look right. Please check and try again."
        )
          .optional()
          .isInt()
          .isLength({ min: 10, max: 20 }),
        body("name", "Name is required.")
          .exists()
          .isLength({ max: 44 }),
        body("dob", "Date of birth is invalid.")
          .exists()
          .isDate()
          .isBefore(cA)
          .isAfter(cB),
        body("address", "Address is required.")
          .exists()
          .isLength({ max: 50 })
      ];
    }
    case "createUserStep2": {
      return [
        body("email", "Invalid email for verification.")
          .exists()
          .normalizeEmail()
          .isEmail(),
        body("account_holder_name", "Account holder's name is required.")
          .exists()
          .isLength({ max: 50 }),
        body("account_number", "Account number is invalid.")
          .exists()
          .isLength({ min: 6, max: 20 }),
        body("bank_name", "Bank Name is invalid.")
          .exists()
          .isLength({ max: 50 }),
        body("branch", "Branch name is invalid.")
          .exists()
          .isLength({ max: 50 })
      ];
    }
  }
};

module.exports = validate;
