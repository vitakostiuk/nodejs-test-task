const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, joiSchemas } = require("../../models/users");
const createError = require("../../helpers/createError");

const { SECRET_KEY } = process.env;

const signup = async (req, res, next) => {
  try {
    const { id, password } = req.body;

    // Перевіряємо, чи є користувач з таким email.
    const user = await User.findOne({ id });

    if (user) {
      throw createError(409, `${id} in use`);
    }

    // Перевіряємо тіло запиту за допомогою joi
    const { error } = joiSchemas.signup.validate(req.body);
    if (error) {
      throw createError(400, error.message);
    }

    // Хешуємо пароль
    const hashPassword = await bcrypt.hash(password, 10);

    // Якщо немає користувача з таким емейл, то зберігаємо користувача в колекціїю users
    // В result нам поаертається об'єкт з такими ж полями, як прописані в схемі моделі + id
    const result = await User.create({
      ...req.body,
      password: hashPassword,
    });

    console.log(result);

    // Create token
    const payload = {
      id: result._id,
      password: hashPassword,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "10m" });

    await User.findByIdAndUpdate(result._id, { token });

    // Повертаэмо на фронтенд об'єкт user(нижче)
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = signup;
