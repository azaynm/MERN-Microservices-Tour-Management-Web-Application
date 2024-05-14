const { Router } = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary");
const Activity = require("../models/activitiy.model.js");



const router = Router();

exports.getActivities = async (req, res) => {
    try {
        const activities = await Activity.find();
        res.json(activities);
    } catch (error) {
        console.error(`Error fetching Activities:`, error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.createActivity = async (req, res) => {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const name = req.body.name;
    const description = req.body.description;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const participantsCount = req.body.participantsCount;
    const cost = req.body.cost;
    const date = req.body.date;
    const image = result.secure_url;

    const newActivityData = {
        name,
        description,
        startTime,
        endTime,
        participantsCount,
        cost,
        date,
        image

    }

    const newActivity = new Activity(newActivityData);

    newActivity.save()
        .then(() => res.json('Activity Added'))
        .catch(err => res.status(400).json('Error: ' + err));
  };

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

router.get('/activities', async (req, res) => {
    try {
        const activities = await Activity.find();
        res.json(activities);
    } catch (error) {
        console.error(`Error fetching Activities:`, error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post("/upload", upload.single("image"), async (req, res) => {

    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const name = req.body.name;
    const description = req.body.description;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const participantsCount = req.body.participantsCount;
    const cost = req.body.cost;
    const date = req.body.date;
    const image = result.secure_url;

    const newActivityData = {
        name,
        description,
        startTime,
        endTime,
        participantsCount,
        cost,
        date,
        image

    }

    const newActivity = new Activity(newActivityData);

    newActivity.save()
        .then(() => res.json('Activity Added'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/get-activity', async (req, res) => {
    const id = req.body.id;
    const activity = await Activity.findById(id);
    res.json(activity);
})


router.get('/hotel/:hotelId', async (req, res) => {
    let hotelId = req.params.hotelId;

    try {
        const foodItems = await Food.find({ hotelId: String(hotelId) });
        res.json(foodItems);
    } catch (error) {
        console.error(`Error fetching ${hotelId}:`, error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/get-cuisines/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Query MongoDB to retrieve distinct cuisines for the specified hotelId
        const distinctCuisines = await Food.distinct('cuisines', { hotelId: id });

        const cuisinesData = [];

        // Loop through each distinct cuisine
        for (const cuisine of distinctCuisines) {
            // Find the first item of the cuisine
            const firstItem = await Food.findOne({ cuisines: cuisine, hotelId: id });

            // Push cuisine data along with imageUrl of the first item to cuisinesData array
            cuisinesData.push({
                cuisine: cuisine,
                image: firstItem ? firstItem.image : null
            });
        }

        res.json({ cuisines: cuisinesData });
    } catch (error) {
        console.error('Error fetching cuisines:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/filter-by-cuisine', async (req, res) => {
    try {
        const { hotelId, cuisineName } = req.body;

        // Query MongoDB to find items with the specified hotelId and cuisine
        const items = await Food.find({ hotelId, cuisines: cuisineName });

        res.json({ items });
    } catch (error) {
        console.error('Error filtering items by cuisine:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




// router.get('/get-cuisines/:id', async (req, res) => {
//   try {
//     const id = req.params.id;

//     // Query MongoDB to retrieve distinct cuisines for the specified hotelId
//     const cuisines = await Food.distinct('cuisines', { hotelId: id });

//     res.json({ cuisines });
//   } catch (error) {
//     console.error('Error fetching cuisines:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });



// router.get('/appetizers', async (req, res) => {
//   try {
//     const appetizers = await Food.find({ category: 'Appetizers' });
//     res.json(appetizers);
//   } catch (error) {
//     console.error("Error fetching appetizers:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.get('/side-dishes', async (req, res) => {
//   try {
//     const sideDishes = await Food.find({ category: 'Side Dishes' });
//     res.json(sideDishes);
//   } catch (error) {
//     console.error("Error fetching side dishes:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.get('/salads', async (req, res) => {
//   try {
//     const salads = await Food.find({ category: 'Salads' });
//     res.json(salads);
//   } catch (error) {
//     console.error("Error fetching salads:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.get('/soups', async (req, res) => {
//   try {
//     const soups = await Food.find({ category: 'Soups' });
//     res.json(soups);
//   } catch (error) {
//     console.error("Error fetching soups:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.get('/desserts', async (req, res) => {
//   try {
//     const desserts = await Food.find({ category: 'Desserts' });
//     res.json(desserts);
//   } catch (error) {
//     console.error("Error fetching desserts:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.get('/beverages', async (req, res) => {
//   try {
//     const beverages = await Food.find({ category: 'Beverages' });
//     res.json(beverages);
//   } catch (error) {
//     console.error("Error fetching beverages:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });


// router.get('/specials', async (req, res) => {
//   try {
//     const specials = await Food.find({ category: 'Specials' });
//     res.json(specials);
//   } catch (error) {
//     console.error("Error fetching specials:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });




router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const food = await Food.findById(id);

    res.json(food)
})

router.get('/getImage/:id', async (req, res) => {
    const id = req.params.id;
    const food = await Food.findById(id);
    res.json(food.image);

})
