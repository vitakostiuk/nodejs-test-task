const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, joiSchemas } = require("../../models/user");
const createError = require("../../helpers/createError");

const { SECRET_KEY } = process.env;

const signin = async (req, res, next) => {
  try {
    const joiEmail = joiSchemas.signupEmail.validate(req.body);
    const joiPhone = joiSchemas.signupPhone.validate(req.body);

    if (joiPhone.error && joiEmail.error) {
      throw createError(
        400,
        "Fails to match the required email or phone pattern"
      );
    }

    const { id, password } = req.body;

    const user = await User.findOne({ id });
    if (!user) {
      throw createError(401, "Email or password is wrong");
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw createError(401, "Email or password is wrong");
    }

    // Create token
    const payload = {
      id: user._id,
      password: user.password,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "10m" });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token,
    });
  } catch (error) {}
};

module.exports = signin;
