import axios from 'axios';
import React from 'react'
import FormData from 'form-data';

import Swal from 'sweetalert2';
import { useState, } from "react";
import { useLocation } from 'react-router-dom';

const API_BASE = "http://localhost:4000";

const AddFood = ({ categories }) => {

    const [formErrors, setFormErrors] = useState({});
    const cuisines = ["Italian Cuisine", "Japanese Cuisine", "Indian Cuisine", "French Cuisine"];

    const location = useLocation();
    const { hotel } = location.state;

    const [file, setFile] = useState(null);
    const [newFood, setNewFood] = useState(
        {
            name: '',
            description: '',
            ingredients: [],
            price: '',
            cuisines: '',
            hotelId: hotel.value,
            image: ''
        }
    );


    const handleChange = ({ target }) => {
        setNewFood({ ...newFood, [target.name]: target.value });
    }

    const handlePhoto = ({ target }) => {
        setFile(URL.createObjectURL(target.files[0]));
        setNewFood({ ...newFood, image: target.files[0] });
        console.log(newFood.image);
    }

    const handleIngredientsChange = (event) => {
        setNewFood({ ...newFood, ingredients: event.target.value.split('\n') });
    }

    const validateForm = () => {
        let errors = {};
        let formIsValid = true;

        if (!newFood.name.trim()) {
            errors.name = "Name is required";
            formIsValid = false;
        }

        if (!newFood.description.trim()) {
            errors.description = "Description is required";
            formIsValid = false;
        }

        if (newFood.ingredients.length === 0 || newFood.ingredients[0].trim() === '') {
            errors.ingredients = "At least one ingredient is required";
            formIsValid = false;
        }

        if (!newFood.price.trim()) {
            errors.price = "Price is required";
            formIsValid = false;
        } else if (isNaN(newFood.price) || parseFloat(newFood.price) <= 0) {
            errors.price = "Price must be a valid number greater than 0";
            formIsValid = false;
        }

        if (!newFood.cuisines) {
            errors.cuisines = "Cuisine selection is required";
            formIsValid = false;
        }

        setFormErrors(errors);
        return formIsValid;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const formData = new FormData();

        formData.append('name', newFood.name);
        formData.append('description', newFood.description);
        formData.append('ingredients', newFood.ingredients.join('\n'));
        formData.append('price', newFood.price);
        formData.append('cuisines', newFood.cuisines);
        formData.append('hotelId', newFood.hotelId);
        formData.append('image', newFood.image);


        console.log(formData.image);


        await Swal.fire({
            title: 'Do you want to add this food?',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Add',
            denyButtonText: `Cancel`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire('Food Added!', '', 'success')
                try {
                    await axios.post('http://localhost:4000/food/upload', formData)
                        .then(res => {
                            console.log(res);
                            setNewFood({
                                name: '',
                                description: '',
                                ingredients: [],
                                price: '',
                                cuisines: '',
                                image: ''
                            });
                            setFile(null);
                        })
                        .catch(err => {
                            console.log(err);
                        });

                } catch (error) {

                }
            } else if (result.isDenied) {
                Swal.fire('Error Occured', '', 'info')
            }
        });



    }

    return (
        <section className="vh-100" style={{ backgroundColor: '#FFEFCD' }}>
            <div className="container-fluid h-custom h-100">
                <div className="row d-flex justify-content-center align-items-center h-100s h-100">
                    <div className="col-md-9 col-lg-6 col-xl-5 d-flex" style={{ backgroundColor: '#F3F3F3' }}>
                        <div className="mb-4 d-flex justify-content-center">
                            <img src={file} style={{ width: '300px', height: '300px' }} />
                        </div>
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="form-outline mb-4">
                                    <h4 style={{ color: '#000' }}>Add Foods for {hotel.name}</h4>
                                </div>
                                <div className="form-outline mb-4">
                                    <input
                                        className="form-control"
                                        type="file"
                                        name="image"
                                        onChange={handlePhoto}
                                    />
                                </div>
                                <div className="form-outline mb-4">
                                    <input
                                        className="form-control"
                                        placeholder="Enter Food Name"
                                        name="name"
                                        value={newFood.name}
                                        onChange={handleChange}
                                        style={{ backgroundColor: '#FFFFFF' }}
                                    />
                                    <div className="text-danger">{formErrors.name}</div>
                                </div>
                                <div className="form-outline mb-4">
                                    <input
                                        className="form-control"
                                        placeholder="Enter Food Description"
                                        name="description"
                                        value={newFood.description}
                                        onChange={handleChange}
                                        style={{ backgroundColor: '#FFFFFF' }}
                                    />
                                    <div className="text-danger">{formErrors.description}</div>
                                </div>
                                <div className="form-outline mb-4">
                                    <textarea
                                        className="form-control"
                                        placeholder="Enter Ingredients (one per line)"
                                        name="ingredients"
                                        value={newFood.ingredients.join('\n')}
                                        onChange={handleIngredientsChange}
                                        style={{ backgroundColor: '#FFFFFF' }}
                                    />
                                    <div className="text-danger">{formErrors.ingredients}</div>
                                </div>
                                <div className="form-outline mb-4">
                                    <select
                                        className="form-select"
                                        name="cuisines"
                                        value={newFood.cuisines}
                                        onChange={handleChange}
                                        style={{ backgroundColor: '#FFFFFF' }}
                                    >
                                        <option value="">Select Food Cuisine</option>
                                        {cuisines.map((cuisine, index) => (
                                            <option key={index} value={cuisine} style={{ backgroundColor: '#FFFFFF' }}>{cuisine}</option>
                                        ))}
                                    </select>
                                    <div className="text-danger">{formErrors.cuisines}</div>
                                </div>
                                <div className="form-outline mb-4">
                                    <input
                                        className="form-control"
                                        placeholder="Enter Price"
                                        name="price"
                                        value={newFood.price}
                                        onChange={handleChange}
                                        style={{ backgroundColor: '#FFFFFF' }}
                                    />
                                    <div className="text-danger">{formErrors.price}</div>
                                </div>
                                <div className="text-center text-lg-start mt-4 pt-2">
                                    <input className="btn btn-primary" type="submit" value="Add Food" style={{ backgroundColor: '#24FF00', borderColor: '#24FF00' }} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>


    )
}

export default AddFood