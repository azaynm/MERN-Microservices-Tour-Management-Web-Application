const {Router} = require("express");
const mongoose = require("mongoose");
const OrderedFood = require("../models/OrderedFood.js");

const router = Router();



router.get('/get-orders/:userId', async (req, res) => {
    try {
    const userId = req.params.userId;
      const foods = await OrderedFood.find({customerId: userId});
      res.json(foods);
    } catch (error) {
      console.error(`Error fetching Foods:`, error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

router.post('/ordered-food', async (req, res) => {
    try {
        // Extracting data from the request body
        const { customerId, orderedDate, total, foods } = req.body;

        // Validate data before saving
        if (!customerId || !orderedDate || !total || !foods || !Array.isArray(foods)) {
            return res.status(400).json({ message: "Invalid data format" });
        }

        // Create a new instance of OrderedFood model
        const orderedFood = new OrderedFood({
            customerId,
            orderedDate,
            total,
            foods
        });

        // Saving the new ordered food item to the database
        const savedOrderedFood = await orderedFood.save();

        // Sending a success response with the saved ordered food item
        res.status(201).json(savedOrderedFood);
    } catch (error) {
        // Sending an error response if something went wrong
        console.error("Error saving ordered food:", error);
        res.status(500).json({ message: "Failed to save ordered food" });
    }
});


router.get('/ordered-foods/get-foods/:orderId', async (req, res) => {
    const orderId = req.params.orderId;

    try {
        // Fetch ordered foods based on orderId
        const orderedFoods = await OrderedFood.findById(orderId);

        if (!orderedFoods) {
            return res.status(404).json({ message: 'Ordered foods not found' });
        }

        res.status(200).json({ orderedFoods });
    } catch (error) {
        console.error('Error fetching ordered foods:', error);
        res.status(500).json({ message: 'Failed to fetch ordered foods' });
    }
});


module.exports = router;
