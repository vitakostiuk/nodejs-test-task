const express = require("express");

const ctrl = require("../../controllers/users");

const login = require("../../middlewares/login");

// Метод Router(); створює міні-додаток, в якому можна зберігати маршрути
const router = express.Router();

// Описуємо маршрути і оброблювачі запиту(контроллери)

// register
router.post("/signup", ctrl.signup);

// signin-login
router.post("/signin", ctrl.signin);

// info
router.get("/info", login, ctrl.info);

// logout
router.get("/logout", login, ctrl.logout);

module.exports = router;
