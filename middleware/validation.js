const { body, validationResult, checkSchema } = require("express-validator");

function validate() {
  return [
    body("id", "id not valid number").exists().isNumeric(),
    body("name", "name dosn`t not exists or invalid")
      .exists()
      .isString()
      .escape(),
    body("gender", "password doesn't exists").isIn(["male", "female"]),
    (req, res, next) => {
      try {
        validationResult(req).throw();
        next();
      } catch (err) {
        console.log(err);
        res.status(400).json({
          status: 400,
          error: err.errors.map((value) => value.msg).join(),
        });
      }
    },
  ];
}

function validateSchema(schema) {
  const validationMiddleware = checkSchema(schema);
  return async (req, res, next) => {
    await validationMiddleware.run(req);
    const result = validationResult(req);
    if (result.isEmpty()) {
      next();
      return;
    }
    const error = Error(
      result
        .array()
        .map((value) => value.msg)
        .join()
    );
    error.statusCode = 400;
    next(error);
  };
}

//TODO 5: Add missing fields
const jediSchema = {
  id: {
    isInt: true,
    errorMessage: "ID is wrong",
    in: ["body"],
  },
  name: {
    isString: {
      errorMessage: "Name is wrong",
    },
    isLength: {
      errorMessage: "Name should be 4 chars long",
      options: { min: 4 },
    },
  },
  height: {
    isInt: {
      errorMessage: "Height should be between 0 and 300",
      options: { min: 0, max: 300 },
    },
  },
  mass: {
    isInt: {
      errorMessage: "Mass should be greater than 0",
      options: { min: 0 },
    },
  },
  hair_color: {
    isString: {
      errorMessage: "Hair Color is wrong",
    },
    isLength: {
      errorMessage: "Hair Color should be more than 3 chars",
      options: { min: 3 },
    },
  },
  skin_color: {
    isString: {
      errorMessage: "Skin Color is wrong",
    },
    isLength: {
      errorMessage: "Skin Color should be more than 3 chars",
      options: { min: 3 },
    },
  },
  birth_year: {
    isString: {
      errorMessage: "Birth Year is wrong",
    },
    isLength: {
      errorMessage: "Birth Year should be more than 4 chars",
      options: { min: 4 },
    },
  },
  eye_color: {
    isString: {
      errorMessage: "Eye Color is wrong",
    },
    isLength: {
      errorMessage: "Eye Color should be more than 4 chars",
      options: { min: 4 },
    },
  },
  gender: {
    isString: {
      errorMessage: "Gender is wrong",
    },
    notEmpty: true,
  },
};

module.exports = {
  validateSchema,
  jediSchema,
};
