const express = require("express");
const activityController = require("../controllers/activity.controller");

const multer = require("multer");
const cloudinary = require("cloudinary");

// const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Public routes
// router.post("/signup", userController.signup);
// router.post("/login", userController.login);

// Protected routes
// router.use(authMiddleware.protect); 

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error("Only image files are accepted!"), false);
    }
    cb(null, true);
};


const upload = multer({ storage: storage, fileFilter: imageFilter });
router.post("/", upload.single("image"), activityController.createActivity); 
router.get("/", activityController.getActivities); 
router.get("/:activityId", activityController.getActivityById); 
router.delete("/:activityId", activityController.deleteActivityById); 
// router.patch("/:id", userController.updateUser); 
// router.delete("/:id", userController.deleteUser); 

module.exports = router;
