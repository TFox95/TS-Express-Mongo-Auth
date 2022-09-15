"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../controllers/authentication"));
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
const extractUser_1 = __importDefault(require("../middleware/extractUser"));
const router = express_1.default.Router();
router.post("/validateToken", extractJWT_1.default, authentication_1.default.validateToken);
router.post("/deleteUser", extractUser_1.default);
router.post("/register", authentication_1.default.registerController);
router.post("/login", authentication_1.default.loginController);
router.post("/logout", authentication_1.default.logoutController);
router.get("/getUsers", authentication_1.default.getUsers);
module.exports = router;
