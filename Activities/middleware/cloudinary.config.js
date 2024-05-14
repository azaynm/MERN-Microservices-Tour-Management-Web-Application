
const multer = require('multer')
const cloudinary = require('cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "samples",
        format: async () => "png",
        public_id: (req, file) => file.filename,
    },
});

const parser = multer({ storage: storage});

export default parser;