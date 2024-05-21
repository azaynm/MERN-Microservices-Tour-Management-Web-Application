import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ViewActivities = () => {
    const API_BASE = "http://localhost:4000";
    const location = useLocation();
    const { hotel } = location.state;

    const loggedInCustomer = "cus1";
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]); // Define selectedActivities state
    const [selectedActivities2, setSelectedActivities2] = useState([]); // Define selectedActivities state
    const [mostPopularActivity, setMostPopularActivity] = useState("");

    // Function to fetch the most purchased activity
    const fetchMostPurchasedActivity = async () => {
        try {
            const response = await axios.get(`${API_BASE}/activity/api/purchased-activities/most-purchased-activity/${hotel.value}`);
            setMostPopularActivity(response.data._id);
            console.log("popular ", response.data._id)
        } catch (error) {
            console.error('Error fetching most purchased activity:', error);
        }
    };

    useEffect(() => {
        const hotelId = hotel.value;
        fetchActivitiesByHotel(hotelId)
            .then(data => setActivities(data))
            .catch(error => console.error(error));

        // Fetch most purchased activity when component mounts
        fetchMostPurchasedActivity();
    }, [hotel]);

    const fetchActivitiesByHotel = async (hotelId) => {
        try {
            const response = await axios.post(`${API_BASE}/activity/filter-by-hotel`, { hotelId });
            const items = response.data.items.map(item => ({ ...item, participantsCount: 1, isSelected: false, totalCost: 0 }));
            console.log("Fetched Items", items)
            return items;
        } catch (error) {
            console.error('Error fetching items by activity:', error);
            throw new Error('Failed to fetch items by activity');
        }
    };

    useEffect(() => {
        const hotelId = hotel.value;
        fetchActivitiesByHotel(hotelId)
            .then(data => setActivities(data))
            .catch(error => console.error(error));
    }, [hotel]);

    const handleParticipantCountChange = (activityIndex, count) => {
        const updatedActivities = [...activities];
        updatedActivities[activityIndex].participantsCount = count;
        setActivities(updatedActivities);
    }

    const addToCart = (activity) => {
        const updatedActivities = [...activities];
        const index = updatedActivities.findIndex(a => a === activity);
        updatedActivities[index].isSelected = !updatedActivities[index].isSelected;
        setActivities(updatedActivities);

        // If activity is selected, add it to selectedActivities, otherwise remove it
        if (updatedActivities[index].isSelected) {
            setSelectedActivities(prevState => [...prevState, updatedActivities[index]]);
        } else {
            setSelectedActivities(prevState => prevState.filter(a => a !== updatedActivities[index]));
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    

    const removeFromCart = (activity) => {
        const updatedActivities = [...activities];
        const index = updatedActivities.findIndex(a => a === activity);
        updatedActivities[index].isSelected = false; // Set isSelected to false to remove from cart
        setActivities(updatedActivities);
        setSelectedActivities(prevState => prevState.filter(a => a !== activity));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    

    const calculateTotalCost = (activity) => {
        return activity.cost * activity.participantsCount;
    }

    const redirectToActivity = () => {
        navigate('/finalize', { state: { hotel } });
    }

    const addActivityToDB = (selectedActivities) => {
        console.log(selectedActivities);
        const API_BASE = 'http://localhost:4000';

        // Create an array to store formatted food items
        const formattedActivities = [];

        // Iterate over each selected beverage to extract its foods and format them
        selectedActivities.forEach(activity => {

            // Add formatted food item to the array
            formattedActivities.push({
                name: activity.name,
                description: activity.description,
                hotelId: activity.hotelId,
                image: activity.image,
                startTime: activity.startTime,
                endTime: activity.endTime, // Assign formatted ingredients array
                participantsCount: activity.participantsCount,
                cost: activity.cost,
                totalCost: activity.cost* activity.participantsCount
            });
        });

        // Create the postData object with formatted food items
        const postData = {
            customerId: loggedInCustomer,
            orderedDate: new Date().toISOString(), // Format date to "YYYY-MM-DDTHH:mm:ss.sssZ"
            total: selectedActivities.reduce((acc, activty) => acc + (activty.cost * activty.participantsCount), 0),
            activities: formattedActivities
        };

        console.log("date:", postData.orderedDate)
        console.log("Post data", postData);

        // Send a POST request to add the formatted food items to the database
        axios.post(`${API_BASE}/activity/purchased-activities/add-purchased-activity`, postData)
            .then(response => {
                console.log("Successfully added:", response.data);
                redirectToActivity();
            })
            .catch(error => {
                console.error("Error adding:", error);
            });
    };

    return (
<>
    <div className="scrollable-container">
        <div className="row">
            <div className="col-lg-8 d-flex flex-wrap">
                {activities.map((activity, index) => (
                    <div key={index} className="col-lg-6 mb-3">
                        <div className={`card`} style={{ width: '100%', backgroundColor: '#FFF', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                            <div className="card">
                                <img src={activity.image} className="card-img-top" alt={activity.name} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <div className='d-flex align-items-center'>
                                            <div>{activity.name}</div>
                                            {mostPopularActivity === activity.name && <span className="badge badge-warning ml-2 bg-success">POPULAR</span>}
                                        </div>
                                    </h5>
                                    <p className="card-text"><strong>Description:</strong> {activity.description}</p>
                                    <p className="card-text"><strong>Start Time:</strong> {activity.startTime}</p>
                                    <p className="card-text"><strong>End Time:</strong> {activity.endTime}</p>
                                    <p className="card-text"><strong>Cost Per Person:</strong> Rs. {activity.cost}</p>
                                    <p className="card-text"><strong>Total Cost:</strong> Rs. {calculateTotalCost(activity)}</p>
                                    <div className="input-group mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            style={{ backgroundColor: '#F3F3F3' }}
                                            value={activity.participantsCount}
                                            onChange={(e) => handleParticipantCountChange(index, e.target.value)}
                                            disabled={activity.isSelected}
                                        />
                                        
                                        <button
                                            className="btn btn-danger"
                                            type="button"
                                            onClick={() => activity.isSelected ? removeFromCart(activity) : addToCart(activity)}
                                            
                                        >
                                            {activity.isSelected ? 'Remove' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="col-lg-4">
                <div className="mb-3" style={{ backgroundColor: '#F3F3F3', padding: '15px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                    <h5>Selected Activities</h5>
                    {selectedActivities.map((selectedActivity, index) => (
                        <div key={index} className="card mb-2">
                            <div className="card-body">
                                <h6 className="card-title">{selectedActivity.name}</h6>
                                <p className="card-text"><strong>Participants Count:</strong> {selectedActivity.participantsCount}</p>
                                <p className="card-text"><strong>Total:</strong> Rs. {selectedActivity.cost * selectedActivity.participantsCount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
    <button
        className="btn btn-primary mt-3"
        style={{ backgroundColor: '#24FF00', borderColor: '#24FF00' }}
        onClick={() => addActivityToDB(selectedActivities)}
        disabled={selectedActivities.length === 0}
    >
        Next
    </button>
    
</>




    )
}

export default ViewActivities;
