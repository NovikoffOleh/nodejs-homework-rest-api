const express = require("express");
const { validateBody } = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controllers/auth-controller");
//const { authenticate } = require("../../middlewares");
const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

//router.get("/users/current", authenticate, ctrl.getCurrent);

//router.post("/logout", authenticate, ctrl.logout);

//router.patch(
  "/users",
  //authenticate,
  validateBody(schemas.updateSubscriptionSchema),
  ctrl.updateSubscription
//);

module.exports = router;