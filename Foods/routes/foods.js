const {Router} = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary");
const Food = require("../models/Food.js");

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

router.get('/foods', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    console.error(`Error fetching Foods:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/upload", upload.single("image"), async (req, res) => {

  const result = await cloudinary.v2.uploader.upload(req.file.path);

  const name = req.body.name;
  const description = req.body.description;
  const ingredients = req.body.ingredients;
  const price = req.body.price;
  const cuisines = req.body.cuisines;
  const hotelId = req.body.hotelId;
  const image = result.secure_url;

  const ingredientsArray = ingredients.split('\n');

  const newFoodData = {
    name,
    description,
    ingredients: ingredientsArray,
    price,
    cuisines,
    hotelId,
    image

  }

  const newFood = new Food(newFoodData);

  newFood.save()
    .then(() => res.json('Food Added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/get-food', async (req, res) => {
  const id = req.body.id;
  const food = await Food.findById(id);
  res.json(food);
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

router.put("/:foodId", upload.single("image"), async (req, res) => {
  const { foodId } = req.params;

  try {
      // Find the food item by its ID
      const food = await Food.findById(foodId);

      // Check if there's a new image uploaded
      if (req.file && req.file.path) {
          // Upload the image to Cloudinary
          const result = await cloudinary.v2.uploader.upload(req.file.path);
          food.image = result.secure_url;
      }

      // Update food details with the data from the request body
      food.name = req.body.name;
      food.description = req.body.description;
      food.ingredients = req.body.ingredients;
      food.price = req.body.price;
      food.cuisines = req.body.cuisines;
      food.hotelId = req.body.hotelId;
      console.log("hotel id:", req.body.hotelId)

      // Save the updated food item
      const updatedFood = await food.save();

      // Send a response indicating success
      res.status(200).json({ message: 'Food updated successfully', data: updatedFood });
  } catch (error) {
      // Handle any errors and send an error response
      console.error('Error updating food:', error);
      res.status(500).json({ error: 'An error occurred while updating food' });
  }
});


router.delete('/:foodId', async (req, res) => {
  const { foodId } = req.params;

  try {
      // Find the food item by its ID
      const food = await Food.findById(foodId);

      // Check if the food item exists
      if (!food) {
          return res.status(404).json({ error: 'Food not found' });
      }

      // Delete the food item from the database
      await food.deleteOne();

      // Send a success response
      res.status(200).json({ message: 'Food deleted successfully' });
  } catch (error) {
      console.error('Error deleting food:', error);
      // Send an error response
      res.status(500).json({ error: 'An error occurred while deleting food' });
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


module.exports = router;