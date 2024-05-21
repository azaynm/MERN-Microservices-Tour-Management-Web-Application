const {Router} = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary");
const Activity = require("../models/Activity");






const router = Router();


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
    const hotelId = req.body.hotelId;
    const image = result.secure_url;

    const newActivityData = {
        name,
        description,
        startTime,
        endTime,
        participantsCount,
        cost,
        hotelId,
        image

    }

    const newActivity = new Activity(newActivityData);

    newActivity.save()
        .then(() => res.json('Activity Added'))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.post('/filter-by-hotel', async (req, res) => {
    try {
      const { hotelId } = req.body;
  
      // Query MongoDB to find items with the specified hotelId and cuisine
      const items = await Activity.find({ hotelId });
  
      res.json({ items });
    } catch (error) {
      console.error('Error filtering items by activity:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
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



router.post('/filter-by-hotel', async (req, res) => {
    const { hotelId } = req.body; // Extract hotelId from request body

    try {
        // Query database for activities based on hotelId
        const activities = await Activity.find({ hotelId });

        // Send response with activities
        res.status(200).json({ items: activities });
    } catch (error) {
        // Handle errors and send appropriate response
        console.error('Error fetching activities by hotel:', error);
        res.status(500).json({ error: 'An error occurred while fetching activities' });
    }
});



router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const activity = await Activity.findById(id);

    res.json(activity)
})


router.put("/:activityId", upload.single("image"), async (req, res) => {
    const { activityId } = req.params;
  
    try {
        // Find the food item by its ID
        const activity = await Activity.findById(activityId);
  
        // Check if there's a new image uploaded
        if (req.file && req.file.path) {
            // Upload the image to Cloudinary
            const result = await cloudinary.v2.uploader.upload(req.file.path);
            activity.image = result.secure_url;
        }

        // Update food details with the data from the request body
        activity.name = req.body.name;
        activity.description = req.body.description;
        activity.startTime = req.body.startTime;
        activity.endTime = req.body.endTime;
        activity.participantsCount = req.body.participantsCount;
        activity.cost = req.body.cost;
  
        // Save the updated food item
        const updatedActivity = await activity.save();
  
        // Send a response indicating success
        res.status(200).json({ message: 'Activity updated successfully', data: updatedActivity });
    } catch (error) {
        // Handle any errors and send an error response
        console.error('Error updating activity:', error);
        res.status(500).json({ error: 'An error occurred while updating activity' });
    }
  });


  
router.delete('/:activitiyId', async (req, res) => {
    const { activitiyId } = req.params;
  
    try {
        // Find the food item by its ID
        const activitiy = await Activity.findById(activitiyId);
  
        // Check if the food item exists
        if (!activitiy) {
            return res.status(404).json({ error: 'Activity not found' });
        }
  
        // Delete the food item from the database
        await activitiy.deleteOne();
  
        // Send a success response
        res.status(200).json({ message: 'Activitiy deleted successfully' });
    } catch (error) {
        console.error('Error deleting activitiy:', error);
        // Send an error response
        res.status(500).json({ error: 'An error occurred while deleting activitiy' });
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




router.get('/getImage/:id', async (req, res) => {
    const id = req.params.id;
    const food = await Food.findById(id);
    res.json(food.image);

})

module.exports = router;