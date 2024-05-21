import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:4000";

const ViewEditFood = () => {
    const location = useLocation();
    const { hotel, cuisine } = location.state;

    const [foods, setFoods] = useState([]);
    const [selectedFoods, setSelectedFoods] = useState([]);

    useEffect(() => {
        fetchItemsByCuisine(hotel.value, cuisine.cuisine);
    }, [hotel, cuisine]);

    const fetchItemsByCuisine = async (hotelId, cuisineName) => {
        try {
            const response = await axios.post(`${API_BASE}/food/filter-by-cuisine`, { hotelId, cuisineName });
            const items = response.data.items.map(item => ({ ...item, isSelected: false }));
            setFoods(items);
        } catch (error) {
            console.error('Error fetching items by cuisine:', error);
            throw new Error('Failed to fetch items by cuisine');
        }
    };

    const toggleFoodSelection = (foodId) => {
        setFoods(prevItems => {
            return prevItems.map(item => {
                if (item._id === foodId) {
                    return { ...item, isSelected: !item.isSelected };
                }
                return item;
            });
        });
    };

    const addToSelectedFoods = () => {
        const selected = foods.filter(food => food.isSelected);
        setSelectedFoods(selected);
    };

    const editFood = (foodId) => {
        navigate('/edit-food', { state: { foodId, hotel } });
    };

    const deleteFood = async (foodId) => {

        await Swal.fire({
            title: 'Do you want to remove this food?',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Remove',
            denyButtonText: `Cancel`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire('Food Deleted!', '', 'success')
                try {
                    await axios.delete(`${API_BASE}/food/${foodId}`);
                    setFoods(prevItems => prevItems.filter(item => item._id !== foodId));
                    Swal.fire({
                        title: 'Success!',
                        text: 'Food deleted successfully',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } catch (error) {
                    console.error('Error deleting food:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'An error occurred while deleting food',
                        icon: 'error'
                    });
                }
                
            } else if (result.isDenied) {
                Swal.fire('Error Occured', '', 'info')
            }
        });


        
    };

    const navigate = useNavigate();

    return (
        <>
            <div className="scrollable-container">
                <div className="row">
                    {foods.map((food, index) => (
                        <div key={index} className="card m-3" style={{ width: '400px', backgroundColor: '#FFEFCD' }}>
                            <div className="card">
                                <img src={food.image} className="card-img-top" alt="..." style={{ width: '100px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <h5 className="card-title">{food.name}</h5>
                                    <p className="card-text">Rs. {food.price}</p>
                                    <div className="input-group mb-3">
                                        <button
                                            className="btn btn-outline-primary"
                                            type="button"
                                            onClick={() => editFood(food._id)}
                                            style={{ backgroundColor: '#FFDB8B', borderColor: '#FFDB8B' }}
                                        >
                                            Edit Food
                                        </button>
                                       
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={() => deleteFood(food._id)}
                                            style={{ backgroundColor: '#FFDB8B', borderColor: '#FFDB8B' }}
                                        >
                                            Delete Food
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button className="btn btn-primary mt-3" style={{ backgroundColor: '#24FF00', borderColor: '#24FF00' }} onClick={addToSelectedFoods}>Next</button>
        </>
    );
};

export default ViewEditFood;
