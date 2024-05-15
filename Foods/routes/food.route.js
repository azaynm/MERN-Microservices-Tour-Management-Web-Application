

const express = require("express");
const foodController = require("../controllers/food.controller");

const multer = require("multer");
const cloudinary = require("cloudinary");

// const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


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


cloudinary.config({
    cloud_name: "dg7kcjtlu",
    api_key: "189726296272932",
    api_secret: "dMrT32-k3AGZV_6ruShFRIhGdNM"
});

router.post("/upload", upload.single("image"), foodController.createFood);

module.exports = router;