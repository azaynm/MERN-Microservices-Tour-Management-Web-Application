const express = require("express");
const { Router } = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary");
const Food = require("../models/food.model");


const router = Router();



exports.createFood = async (req, res) => {

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
};


