import express from "express";
import authController from "../controllers/authentication";
import extractJWT from "../middleware/extractJWT";
import extractUser from "../middleware/extractUser";

const router = express.Router();

router.post("/validateToken", extractJWT, authController.validateToken);
router.post("/deleteUser", extractUser);
router.post("/register", authController.registerController);
router.post("/login", authController.loginController);
router.post("/logout", authController.logoutController);
router.get("/getUsers", authController.getUsers);

export = router;
