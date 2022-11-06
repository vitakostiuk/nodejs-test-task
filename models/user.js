const { Schema, model } = require("mongoose");

const Joi = require("joi");

const emailRegexp = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
const phoneNumberRegexp = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password is required"],
    },
    id: {
      type: String,
      required: [true, "Id is required"],
      unique: true,
    },
    id_type: {
      type: String,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

// Joi Schemas
const signupSchemaEmail = Joi.object({
  id: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const signupSchemaPhone = Joi.object({
  id: Joi.string().pattern(phoneNumberRegexp).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  id: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const joiSchemas = {
  signupEmail: signupSchemaEmail,
  signupPhone: signupSchemaPhone,
  login: loginSchema,
};

const User = model("user", userSchema);

module.exports = { User, joiSchemas };
