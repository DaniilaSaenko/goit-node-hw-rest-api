const express = require("express");

const ctrl = require("../../controllers/authController");

const {
  authSchema,
  emailSchema,
} = require("../../middleware/validationSchemes");
const { auth } = require("../../middleware/auth");
const { upload } = require("../../middleware/upload");
const validateBody = require("../../middleware/validateBody");

const router = express.Router();

// signup

router.post("/singup", validateBody(authSchema), ctrl.userSignup);

router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post("/verify", validateBody(emailSchema), ctrl.resendVerifyEmail);

// signin

router.post("/login", validateBody(authSchema), ctrl.userLogin);
router.get("/logout", auth, ctrl.userLogout);
router.get("/current", auth, ctrl.userCurrent);
router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  ctrl.userChangeAvatar
);


module.exports = router;
