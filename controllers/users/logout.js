// Токен зберігається на фронтенді в локал сторедж
// Коли робиться логаут, то токен видаляється з локал сторедж
// Нам потрібно його видалити на бекенді

const { User } = require("../../models/users");

const logout = async (req, res) => {
  // Беремо req.user _id юзера
  const { _id } = req.user;
  console.log(req.user);

  // Шукаємо юзера по _id і в його токен записуємо пусту строку
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).send();
  // send() тому що немає тіла в req
};

module.exports = logout;
