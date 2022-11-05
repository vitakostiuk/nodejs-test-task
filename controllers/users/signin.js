const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, joiSchemas } = require("../../models/users");
const createError = require("../../helpers/createError");

const signin = async (req, res, next) => {
  try {
    // Валідація обов"язкових полів
    const { error } = joiSchemas.login.validate(req.body);
    if (error) {
      throw createError(400, error.message);
    }

    const { id, password } = req.body;

    const user = await User.findOne({ id });
    if (!user) {
      throw createError(401, "Email or password is wrong");
    }

    // Порівнюємо пароль з бази (user.password), з тим, що ввів юзер. Для цього в bcrypt
    // є метод compare(). Він повертає true або false
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw createError(401, "Email or password is wrong");
    }

    res.status(200).json({
      token: user.token,
    });
  } catch (error) {}
};

module.exports = signin;
