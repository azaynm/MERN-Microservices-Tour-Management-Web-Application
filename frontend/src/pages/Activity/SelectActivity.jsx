import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SelectActivity = () => {
    const API_BASE = "http://localhost:4000";
    const location = useLocation();
    const { hotel} = location.state;

    const loggedInCustomer = "cus1";
    const navigate = useNavigate();
    const [activites, setActivities] = useState([]);
    const [selectedBeverages, setSelectedBeverages] = useState([]);

    const fetchActivities = async (hotelId, cuisineName) => {
        try {
            const response = await axios.post(`${API_BASE}/activity/api/activitiy/`, { hotelId, cuisineName });
            const items = response.data.items.map(item => ({ ...item, selectedQuantity: 1, isSelected: false }));
            
            return items;
        } catch (error) {
            console.error('Error fetching items by cuisine:', error);
            throw new Error('Failed to fetch items by cuisine');
        }

    };

    useEffect(() => {
        const hotelId = hotel.value; // Assuming hotel object has a value property representing the hotelId
        const cuisineName = cuisine.cuisine; // Assuming cuisine object has a cuisine property representing the cuisine name
        fetchItemsByCuisine(hotelId, cuisineName)
            .then(data => setActivities(data))
            .catch(error => console.error(error));
    }, [hotel, cuisine]);

    const redirectToActivity = ()=>{
        navigate('/select-activity', { state: { hotel } })
    }

    const addToCart = (item) => {
        const existingItemIndex = selectedBeverages.findIndex(beverage => beverage._id === item._id);
        if (existingItemIndex !== -1) {
            // Item already exists, update quantity
            const updatedBeverages = [...selectedBeverages];
            updatedBeverages[existingItemIndex].quantity += item.selectedQuantity;
            setSelectedBeverages(updatedBeverages);
        } else {
            // Item does not exist, add to cart
            setSelectedBeverages(prevSelected => [...prevSelected, { ...item, quantity: item.selectedQuantity }]);
        }

        toggleItemSelection(item.id); // Toggle item selection

        Swal.fire({
            title: "Item Added",
            text: `${item.name} has been added to your cart.`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });

        redirectToActivity();
    };

    const toggleItemSelection = (itemId) => {
        setActivities(prevItems => {
            return prevItems.map(item => {
                if (item._id === itemId) {
                    return { ...item, isSelected: !item.isSelected };
                }
                return item;
            });
        });
    };

    const updateSelectedQuantity = (index, value) => {
        if (!isNaN(value) && value >= 0) {
            setActivities(prevItems => {
                const updatedItems = [...prevItems];
                updatedItems[index].selectedQuantity = value;
                return updatedItems;
            });
        }
    };

    const removeItem = (item) => {
        setSelectedBeverages(prevSelected => prevSelected.filter(beverage => beverage._id !== item._id));
    };

    const addFoodToDB = (selectedBeverages) => {
        console.log(selectedBeverages);
        const API_BASE = 'http://localhost:4000';
    
        // Create an array to store formatted food items
        const formattedFoods = [];
    
        // Iterate over each selected beverage to extract its foods and format them
        selectedBeverages.forEach(beverage => {
            // Format ingredients array to ensure it's properly handled
            const formattedIngredients = beverage.ingredients.map(ingredient => ingredient.trim());
    
            // Add formatted food item to the array
            formattedFoods.push({
                name: beverage.name,
                description: beverage.description,
                hotelId: beverage.hotelId,
                image: beverage.image,
                ingredients: formattedIngredients, // Assign formatted ingredients array
                price: beverage.price,
                quantity: beverage.quantity
            });
        });
    
        // Create the postData object with formatted food items
        const postData = {
            customerId: loggedInCustomer,
            orderedDate: new Date().toISOString(), // Format date to "YYYY-MM-DDTHH:mm:ss.sssZ"
            total: selectedBeverages.reduce((acc, beverage) => acc + (beverage.price * beverage.quantity), 0),
            foods: formattedFoods
        };
        
    console.log("date:", postData.orderedDate)
        console.log("Post data", postData);
    
        // Send a POST request to add the formatted food items to the database
        axios.post(`${API_BASE}/food/ordered/ordered-food`, postData)
            .then(response => {
                console.log("Successfully added:", response.data);
            })
            .catch(error => {
                console.error("Error adding:", error);
            });
    };
    

    return (
        <>
            <div className="scrollable-container">
                <div className="row">
                    {activites.map((food, index) => (
                        <div key={index} className="card m-3" style={{ width: '400px', backgroundColor: '#FFEFCD' }}>
                            <div className="card">
                                <img src={food.image} className="card-img-top" alt="..." style={{ width: '100px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <h5 className="card-title">{food.name}</h5>
                                    <p className="card-text">Rs. {food.sellingPrice}</p>
                                    <div className="input-group mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={food.selectedQuantity}
                                            onChange={(e) => updateSelectedQuantity(index, parseInt(e.target.value))}
                                            style={{ backgroundColor: '#F3F3F3' }}
                                        />
                                        <button className="btn btn-outline-danger" type="button" onClick={() => addToCart(food)} style={{ backgroundColor: '#FFDB8B', borderColor: '#FFDB8B' }}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col-lg-2">
                    <div className="mb-3" style={{ backgroundColor: '#F3F3F3' }}>
                        Selected
                        {selectedBeverages.map((item, index) => (
                            <div key={index} className="card">
                                <div className="card-body">
                                    <h6 className="card-title">{item.name}</h6>
                                    <p className="card-text">Quantity: {item.quantity}</p>
                                    <button className="btn btn-danger" onClick={() => removeItem(item)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <button className="btn btn-primary mt-3" style={{ backgroundColor: '#24FF00', borderColor: '#24FF00' }} onClick={() => addFoodToDB(selectedBeverages)}>Next</button>
        </>

    )
}

export default SelectActivity;
