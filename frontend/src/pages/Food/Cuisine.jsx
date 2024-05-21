import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const API_BASE = "http://localhost:4000";

const Cuisine = () => {


    const navigate = useNavigate();

    const location = useLocation();
    const { hotel, method } = location.state;

    const [cuisines, setCuisines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const fetchCuisines = async (hotelId) => {
        console.log("Cuisine", hotel)
        try {
            const response = await axios.get(`${API_BASE}/food/get-cuisines/${hotelId}`);
            return response.data.cuisines;
        } catch (error) {
            console.error('Error fetching cuisines:', error);
            throw new Error('Failed to fetch cuisines');
        }
    };

    useEffect(() => {
        const hotelId = hotel.value; // Provide the actual hotelId here
        setIsLoading(true);
        fetchCuisines(hotelId)
            .then(data => {
                setCuisines(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
            });
    }, []);



    return (
        <div className="d-flex flex-wrap justify-content-center">
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {cuisines.map((cuisine, index) => (
                        <div key={index} className="card m-3" style={{ width: '200px', backgroundColor: '#FFEFCD' }}>
                            <img src={cuisine.image} className="card-img-top" alt={cuisine.cuisine} style={{ height: '150px', objectFit: 'cover' }} />
                            <div className="card-body text-center">
                                <h5 className="card-title">{cuisine.cuisine}</h5>

                                <button className="btn btn-secondary" style={{ backgroundColor: '#FFDB8B', borderColor: '#FFDB8B' }} onClick={() => {
                                    if (method === 'view-foods') {
                                        navigate('/view-foods', { state: { hotel, cuisine } })
                                    } else if (method === 'view-edit-food') {
                                        navigate('/view-edit-food', { state: { hotel, cuisine } });
                                    }
                                }}>
                                    Select Cuisine
                                </button>

                               
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>


    );
};

export default Cuisine;
