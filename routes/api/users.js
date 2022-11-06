const express = require("express");

const ctrl = require("../../controllers/users");

const login = require("../../middlewares/login");

const ctrlWrapper = require("../../helpers/ctrlWrapper");

// Метод Router(); створює міні-додаток, в якому можна зберігати маршрути
const router = express.Router();

// Описуємо маршрути і оброблювачі запиту(контроллери)

// register
router.post("/signup", ctrlWrapper(ctrl.signup));

// signin-login
router.post("/signin", ctrlWrapper(ctrl.signin));

// info
router.get("/info", login, ctrlWrapper(ctrl.info));

// logout
router.get("/logout", login, ctrlWrapper(ctrl.logout));

module.exports = router;
