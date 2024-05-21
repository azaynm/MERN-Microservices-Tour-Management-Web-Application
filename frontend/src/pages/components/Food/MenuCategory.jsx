import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import './MenuCategory.css';

const MenuCategory = ({ hotelId }) => {
    const API_BASE = "http://localhost:4000";
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedBeverages, setSelectedBeverages] = useState([]);

    const fetchMenuItems = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE}/food/hotel/${hotelId}`);
            const items = response.data.map(item => ({ ...item, selectedQuantity: 1, isSelected: false }));
            setMenuItems(items);
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    useEffect(() => {
        console.log("Selected beverages:", selectedBeverages);
    }, [selectedBeverages]);

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
    };

    const toggleItemSelection = (itemId) => {
        setMenuItems(prevItems => {
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
            setMenuItems(prevItems => {
                const updatedItems = [...prevItems];
                updatedItems[index].selectedQuantity = value;
                return updatedItems;
            });
        }
    };

    const removeItem = (item) => {
        setSelectedBeverages(prevSelected => prevSelected.filter(beverage => beverage._id !== item._id));
    };

    return (
        <div className="scrollable-container">
            <div className='d-flex'>
                <div className="row col">
                    {menuItems.map((menuItem, index) => (
                        <div key={index} className={`col ${menuItem.isSelected ? 'selected' : ''}`}>
                            <div className="card h-100">
                                <img src={menuItem.image} className="card-img-top" alt="..." style={{ width: '100px', height: '100px' }} />
                                <div className="card-body">
                                    <h5 className="card-title">{menuItem.name}</h5>
                                    <p className="card-text">Rs. {menuItem.sellingPrice}</p>
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <input
                                            type="number"
                                            className="form-control mx-2"
                                            value={menuItem.selectedQuantity}
                                            onChange={(e) => updateSelectedQuantity(index, parseInt(e.target.value))}
                                        />
                                    </div>
                                    <button className='btn btn-danger mt-2' onClick={() => addToCart(menuItem)}>Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='col col-lg-2'>
                    {selectedBeverages.map((item, index) => (
                        <div key={index}>
                            <div>{item.name}</div>
                            <div>{item.quantity}</div>
                            <button className='btn btn-danger' onClick={() => removeItem(item)}>Remove</button>
                        </div>
                    ))}
                </div>
            </div>
            <button className='btn btn-primary'>Next</button>
        </div>

    );
}

export default MenuCategory;
