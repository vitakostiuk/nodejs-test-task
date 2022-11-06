const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, joiSchemas } = require("../../models/user");
const createError = require("../../helpers/createError");

const { SECRET_KEY } = process.env;

const signup = async (req, res, next) => {
  const { id, password } = req.body;

  const user = await User.findOne({ id });

  if (user) {
    throw createError(409, `${id} in use`);
  }

  let idType;

  const joiEmail = joiSchemas.signupEmail.validate(req.body);
  const joiPhone = joiSchemas.signupPhone.validate(req.body);

  if (!joiEmail.error && joiPhone.error) {
    idType = "email";
  }

  if (!joiPhone.error && joiEmail.error) {
    idType = "phone";
  }

  if (joiPhone.error && joiEmail.error) {
    throw createError(
      400,
      "Fails to match the required email or phone pattern"
    );
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await User.create({
    ...req.body,
    password: hashPassword,
    id_type: idType,
  });

  // Create token
  const payload = {
    id: result._id,
    password: hashPassword,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "10m" });

  await User.findByIdAndUpdate(result._id, { token });

  res.status(201).json({ token, id_type: idType });
};

module.exports = signup;
