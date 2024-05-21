import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AddRestaurant = () => {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        // Fetch hotels from the backend when the component mounts
        const fetchHotels = async () => {
            try {
                const response = await axios.get('http://localhost:4000/food/hotel/hotels');
                setHotels(response.data);
            } catch (error) {
                console.error('Error fetching hotels:', error);
            }
        };

        fetchHotels();
    }, []);

    return (
        <div>
            <h1>Available Hotels</h1>
            <ul>
                {hotels.map(hotel => (
                    <li key={hotel._id}>
                        {/* Link to the Add Restaurant page with hotel ID as a parameter */}
                        <Link to={`/add-restaurant/${hotel._id}`}>{hotel.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AddRestaurant;
