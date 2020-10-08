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
    case "createPostValidation": {
        return [
            body("listing_name", "Listing name is invalid")
            .exists()
            .isLength({ max: 10 }),
            body("listing_type", "Listing tpye is required")
            .exists()
            .isLength({ max: 20 }),
            body("occassion", "Occassion is invalid")
            .exists()
            .isLength({ max: 20 }),
            body("gender", "gender is invalid")
            .exists()
            .isLength({ max: 20 }),
            body("design", "design is invalid")
            .exists()
            .isLength({ max: 20 }),
            body("feature", "feature is invalid")
            .exists()
            .isLength({ max: 20 }),
            body("purchase_price", "Purchase Price is required")
            .exists(),
            
            body("images", "Images is required")
            .exists(),
            
            body("selling_price", "Selling Price is required")
            .exists(),
            
            body("purchase_date", "Purchase date is required")
            .exists()
            .isDate(),
            body("condition", "Condition is required")
            .exists()
            .isLength({ max: 20 }),
            body("category", "Category is required")
            .exists()
            .isLength({ max: 20 }),
            body("measurement", "Measurement is required")
            .exists()
            .isLength({ max: 20 }),
            body("fabric", "Fabric is required")
            .exists()
            .isLength({ max: 20 }),
            body("color", "Color is required")
            .exists()
            .isLength({ max: 20 }),
        ]
    }    

  }
};

module.exports = validate;
