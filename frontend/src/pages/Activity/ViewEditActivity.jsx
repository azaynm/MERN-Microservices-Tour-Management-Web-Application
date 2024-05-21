import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:4000";

const ViewEditActivity = () => {
    const location = useLocation();
    const { hotel, method } = location.state;

    const [activities, setActivities] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]);

    useEffect(() => {
        fetchActivities(hotel.value);
    }, [hotel]);

    const fetchActivities = async (hotelId) => {
        try {
            const response = await axios.post(`${API_BASE}/activity/filter-by-hotel`, { hotelId });
            const items = response.data.items.map(item => ({ ...item, isSelected: false }));
            setActivities(items);
        } catch (error) {
            console.error('Error fetching activities:', error);
            throw new Error('Failed to fetch activities');
        }
    };



    const toggleActivitySelection = (activityId) => {
        setActivities(prevItems => {
            return prevItems.map(item => {
                if (item._id === activityId) {
                    return { ...item, isSelected: !item.isSelected };
                }
                return item;
            });
        });
    };

    const addToSelectedActivities = () => {
        const selected = activities.filter(activity => activity.isSelected);
        setSelectedActivities(selected);
    };

    const editActivity = (activityId) => {
        navigate('/edit-activity', { state: { activityId, hotel } });
    };

    

    const deleteActivity = async (activityId) => {

        await Swal.fire({
            title: 'Do you want to remove this activity?',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Remove',
            denyButtonText: `Cancel`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire('Activity Deleted!', '', 'success')
                try {
                    await axios.delete(`${API_BASE}/activity/${activityId}`);
                    setActivities(prevItems => prevItems.filter(item => item._id !== activityId));
                    Swal.fire({
                        title: 'Success!',
                        text: 'Activity deleted successfully',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } catch (error) {
                    console.error('Error deleting activity:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'An error occurred while deleting activity',
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
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {activities.map((activity, index) => (
                <div key={index} className="col">
                    <div className="card h-100">
                        <img src={activity.image} className="card-img-top" alt={activity.name} style={{ objectFit: 'cover', height: '200px' }} />
                        <div className="card-body">
                            <h5 className="card-title">{activity.name}</h5>
                            <p className="card-text"><strong>Description:</strong> {activity.description}</p>
                            <p className="card-text"><strong>Start Time:</strong> {activity.startTime}</p>
                            <p className="card-text"><strong>End Time:</strong> {activity.endTime}</p>
                            <p className="card-text"><strong>Cost:</strong> Rs. {activity.cost}</p>
                        </div>
                        <div className="card-footer d-flex justify-content-between align-items-center">
                            <button
                                className="btn btn-outline-primary"
                                type="button"
                                onClick={() => editActivity(activity._id)}
                                style={{ backgroundColor: '#FFDB8B', borderColor: '#FFDB8B' }}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => deleteActivity(activity._id)}
                                style={{ backgroundColor: '#FFDB8B', borderColor: '#FFDB8B' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
    <button className="btn btn-primary mt-3" style={{ backgroundColor: '#24FF00', borderColor: '#24FF00' }} onClick={addToSelectedActivities}>Next</button>
</>

    );
};

export default ViewEditActivity;
