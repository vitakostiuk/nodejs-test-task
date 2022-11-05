const { Schema, model } = require("mongoose");

const Joi = require("joi");

// Регулярний вираз для email
// const emailRegexp = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password is required"],
    },
    id: {
      type: String,
      // match: emailRegexp,
      // регулярний вираз пишеться через match
      required: [true, "Id is required"],
      unique: true,
      // unique - поле унікальне. Але,щоб це спрацювало, треба в базі
      // у вкладці indexes створити унікальний індекс по цьому полю, тоді воно стане унікальним
    },
    token: {
      type: String,
      default: null,
    },
  },
  //  versionKey: false - щоб не було версій оновлення
  // timestamps: true - додаються поля "createdAt" i "updateAt"
  { versionKey: false, timestamps: true }
);

// Описуємо схеми валідації Joi тіла запиту
// Схеми валідації для реєстрації i логіну
// pattern() в Joi - це перевірка за регулярним виразом
const signupSchema = Joi.object({
  id: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  id: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

// Імпортуємо joi-схеми як окремий об'єкт joiShemas
const joiSchemas = {
  signup: signupSchema,
  login: loginSchema,
};

// Створюємо модель User - це модель (іменник в однині). model() на основі схеми створює модель
// "user" - назва колекції, з якою потрібно працювати, також в однині
const User = model("user", userSchema);

module.exports = { User, joiSchemas };
