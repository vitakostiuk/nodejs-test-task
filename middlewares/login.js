const createError = require("../helpers/createError");
const jwt = require("jsonwebtoken");
const { User } = require("../models/users");

const { SECRET_KEY } = process.env;

// Що має зробити ф-я login:
// 1. Взяти з заголовків заголовок authorization
// 2. Перевірити, що перше слово Bearer
// 2.1. Якщо ні, повернути 401 помилку (неавторизований)
// 3. Перевірити, що друге слово в заголовку це токен, який ми шифрували і не закінчилась його дія
// 3.1. Якщо ні, повернути 401 помилку (неавторизований)
// 4. Якщо токен валідний, знайти в базі юзера з id, закодованого в токені
// 4.1. Якщо ні, повернути 401 помилку (неавторизований)
// 5. Прикріпити до об'єкту Request користувача в свойство user

const login = async (req, res, next) => {
  // Взяти з заголовків заголовок authorization
  const { authorization = "" } = req.headers;
  // Розділимо його на 2 слова
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(createError(401));
  }

  try {
    // 3. Перевірити, що друге слово в заголовку це токен, який ми шифрували за допомогою SECRET_KEY
    // Тобто перевіряємо, чи валідний токен
    // Якщо все добре, то  jwt.verify повертає payload, звіди деструктуризуємо id
    const { id } = jwt.verify(token, SECRET_KEY);

    // 4. Якщо токен валідний, знайти в базі юзера з id, закодованого в токені
    // Щоб знайти користувача, нам треба модель User
    // Об'єкт user містить всю інформацію про юзера
    const user = await User.findById(id);
    // 4.1. Якщо ні, повернути 401 помилку (неавторизований)
    // Може звернутися юзепр, токен якого видалений, тому треба додати - || !user.token
    if (!user || !user.token) {
      next(createError(401, "Not authorized"));
    }
    // 5. Прикріпити до об'єкту Request користувача в свойство user
    req.user = user;
    next();
  } catch (error) {
    next(createError(401, "Not authorized"));
  }
};

module.exports = login;
