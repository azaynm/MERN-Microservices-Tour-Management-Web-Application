const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Public routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// Protected routes
router.use(authMiddleware.protect); 

router.get("/:id", userController.getUser); 
router.patch("/:id", userController.updateUser); 
router.delete("/:id", userController.deleteUser); 

module.exports = router;
