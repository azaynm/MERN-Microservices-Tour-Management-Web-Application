import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import FormData from 'form-data';

const API_BASE = "http://localhost:4000";

const EditFood = () => {
    const location = useLocation();
    const { foodId, hotel } = location.state;
    const cuisines = ["Italian Cuisine", "Japanese Cuisine", "Indian Cuisine", "French Cuisine"];
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null); // State to store uploaded file
    const [formErrors, setFormErrors] = useState({});
    const [food, setFood] = useState({
        name: "",
        description: "",
        ingredients: [],
        price: "",
        cuisines: "",
        hotelId: ""
    });

    useEffect(() => {
        fetchFoodDetails(foodId);
    }, [foodId]);

    const fetchFoodDetails = async (id) => {
        try {
            const response = await axios.get(`${API_BASE}/food/${id}`);
            setFood(response.data);
            setLoading(false); // Set loading to false when data is fetched
        } catch (error) {
            console.error('Error fetching food details:', error);
        }
    };

    const handleChange = ({ target }) => {
        setFood({ ...food, [target.name]: target.value });
    }

    const handlePhoto = ({ target }) => {
        const selectedFile = target.files[0];
        setFile(URL.createObjectURL(selectedFile)); // Update file state with the object URL
        setFood({ ...food, image: target.files[0] }); // Update food.image with the object URL
    };


    const handleIngredientsChange = (event) => {
        setFood({ ...food, ingredients: event.target.value.split('\n') });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', food.name);
        formData.append('description', food.description);
        formData.append('ingredients', food.ingredients.join('\n'));
        formData.append('price', food.price);
        formData.append('cuisines', food.cuisines);
        formData.append('hotelId', food.hotelId);
        formData.append('image', food.image);
        
        try {
            const result = await Swal.fire({
                title: 'Do you want to update this food?',
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: 'Update',
                denyButtonText: `Cancel`,
            });

            if (result.isConfirmed) {
                Swal.fire('Food Updated!', '', 'success');
                await axios.put(`${API_BASE}/food/${foodId}`, formData);
                setFile(null); // Reset file state after successful upload
            } else if (result.isDenied) {
                Swal.fire('Action Cancelled', '', 'info');
            }
        } catch (error) {
            console.error('Error updating food:', error);
            Swal.fire('Error', 'Failed to update food', 'error');
        }
    }

    return (
        <section className="vh-100" style={{ backgroundColor: '#FFEFCD' }}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="container-fluid h-custom h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100s h-100">
                        <div className="col-md-9 col-lg-6 col-xl-5 d-flex" style={{ backgroundColor: '#F3F3F3' }}>
                            <div className="mb-4 d-flex justify-content-center">
                                <img src={ food.image} style={{ width: '300px', height: '300px' }} alt="Food" />
                            </div>
                            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                                            value={food.name}
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
                                            value={food.description}
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
                                            value={food.ingredients.join('\n')}
                                            onChange={handleIngredientsChange}
                                            style={{ backgroundColor: '#FFFFFF' }}
                                        />
                                        <div className="text-danger">{formErrors.ingredients}</div>
                                    </div>
                                    <div className="form-outline mb-4">
                                        <select
                                            className="form-select"
                                            name="cuisines"
                                            value={food.cuisines}
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
                                            value={food.price}
                                            onChange={handleChange}
                                            style={{ backgroundColor: '#FFFFFF' }}
                                        />
                                        <div className="text-danger">{formErrors.price}</div>
                                    </div>
                                    <div className="text-center text-lg-start mt-4 pt-2">
                                        <input className="btn btn-primary" type="submit" value="Update Food" style={{ backgroundColor: '#24FF00', borderColor: '#24FF00' }} />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </section>
    )
}
export default EditFood;