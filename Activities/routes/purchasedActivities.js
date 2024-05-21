const {Router} = require("express");
const mongoose = require("mongoose");
const PurchasedActivity = require("../models/PurchasedActivity.js");


const router = Router();

// Route to get the most purchased activity for a particular hotel
router.get("/most-purchased-activity/:hotelId", async (req, res) => {
    try {
      const hotelId = req.params.hotelId;
  
      const mostPurchasedActivity = await PurchasedActivity.aggregate([
        {
            $match: { "activities.hotelId": hotelId } 
        },
        {
          $unwind: "$activities",
        },
        {
          $group: {
            _id: "$activities.name",
            totalPurchases: { $sum: 1 },
          },
        },
        {
          $sort: { totalPurchases: -1 },
        },
        {
          $limit: 1,
        },
      ]);
  
      if (mostPurchasedActivity.length > 0) {
        res.json(mostPurchasedActivity[0]);
      } else {
        res.status(404).json({ message: "No activity found" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  
router.get('/get-orders/:userId', async (req, res) => {
    try {
    const userId = req.params.userId;
      const foods = await PurchasedActivity.find({customerId: userId});
      res.json(foods);
    } catch (error) {
      console.error(`Error fetching Foods:`, error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


router.post('/add-purchased-activity', async (req, res) => {
    try {
        // Extracting data from the request body
        const { customerId, orderedDate, total, activities } = req.body;

        // Validate data before saving
        if (!customerId || !orderedDate || !total || !activities || !Array.isArray(activities)) {
            return res.status(400).json({ message: "Invalid data format" });
        }

        // Create a new instance of OrderedFood model
        const purchasedActivity = new PurchasedActivity({
            customerId,
            orderedDate,
            total,
            activities
        });

        // Saving the new ordered food item to the database
        const savedPurchasedActivity = await purchasedActivity.save();

        // Sending a success response with the saved ordered food item
        res.status(201).json(savedPurchasedActivity);
    } catch (error) {
        // Sending an error response if something went wrong
        console.error("Error saving purchased activity:", error);
        res.status(500).json({ message: "Failed to save purchased activity" });
    }
});

router.get('/purchased-activities/get-activities/:orderId', async (req, res) => {
    const orderId = req.params.orderId;

    try {
        // Fetch ordered foods based on orderId
        const purchasedActivities = await PurchasedActivity.findById(orderId);

        if (!purchasedActivities) {
            return res.status(404).json({ message: 'Purchased activities not found' });
        }

        res.status(200).json({ purchasedActivities });
    } catch (error) {
        console.error('Error fetching purchased activities:', error);
        res.status(500).json({ message: 'Failed to fetch purchased activities' });
    }
});


module.exports = router;
