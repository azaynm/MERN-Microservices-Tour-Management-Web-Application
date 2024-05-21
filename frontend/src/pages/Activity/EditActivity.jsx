import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';

const API_BASE = "http://localhost:4000";

const EditActivity = () => {
    const location = useLocation();
    const { activityId, hotel } = location.state;
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null); // State to store uploaded file
    const [formErrors, setFormErrors] = useState({});
    const [activity, setActivity] = useState({
        name: '',
        description: '',
        startTime: '',
        endTime: '',
        participantsCount: '',
        cost: '',
        hotelId: ''
    });

    useEffect(() => {
        fetchActivityDetails(activityId);
    }, [activityId]);

    const fetchActivityDetails = async (id) => {
        try {
            const response = await axios.get(`${API_BASE}/activity/${id}`);
            setActivity(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching activity details:', error);
        }
    };

    const handleChange = ({ target }) => {
        setActivity({ ...activity, [target.name]: target.value });
    }

    const handlePhoto = ({ target }) => {
        const selectedFile = target.files[0];
        setFile(URL.createObjectURL(selectedFile)); // Update file state with the object URL
        setActivity({ ...activity, image: selectedFile }); // Update food.image with the object URL
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', activity.name);
        formData.append('description', activity.description);
        formData.append('startTime', activity.startTime);
        formData.append('endTime', activity.endTime);
        formData.append('participantsCount', activity.participantsCount);
        formData.append('cost', activity.cost);
        formData.append('hotelId', activity.hotelId);
        formData.append('image', activity.image);
        try {
            const result = await Swal.fire({
                title: 'Do you want to update this activity?',
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: 'Update',
                denyButtonText: `Cancel`,
            });

            if (result.isConfirmed) {
                Swal.fire('Activity Updated!', '', 'success');
                await axios.put(`${API_BASE}/activity/${activityId}`, formData);
                setFile(null); // Reset file state after successful upload
            } else if (result.isDenied) {
                Swal.fire('Action Cancelled', '', 'info');
            }
        } catch (error) {
            console.error('Error updating activity:', error);
            Swal.fire('Error', 'Failed to update activity', 'error');
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
                                <img src={activity.image} style={{ width: '300px', height: '300px' }} alt="Activity" />
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
                                            placeholder="Enter Activity Name"
                                            name="name"
                                            value={activity.name}
                                            onChange={handleChange}
                                            style={{ backgroundColor: '#FFFFFF' }}
                                        />
                                    </div>
                                    <div className="form-outline mb-4">
                                        <input
                                            className="form-control"
                                            placeholder="Enter Activity Description"
                                            name="description"
                                            value={activity.description}
                                            onChange={handleChange}
                                            style={{ backgroundColor: '#FFFFFF' }}
                                        />
                                    </div>
                                    <div className="form-outline mb-4">
                                        <input
                                            className="form-control"
                                            placeholder="Select Start Time"
                                            name="startTime"
                                            value={activity.startTime}
                                            onChange={handleChange}
                                            style={{ backgroundColor: '#FFFFFF' }}
                                        />
                                    </div>
                                    <div className="form-outline mb-4">
                                        <input
                                            className="form-control"
                                            placeholder="Select End Time"
                                            name="endTime"
                                            value={activity.endTime}
                                            onChange={handleChange}
                                            style={{ backgroundColor: '#FFFFFF' }}
                                        />
                                    </div>
                                    <div className="form-outline mb-4">
                                        <input
                                            className="form-control"
                                            placeholder="Select Participants Count"
                                            name="participantsCount"
                                            value={activity.participantsCount}
                                            onChange={handleChange}
                                            style={{ backgroundColor: '#FFFFFF' }}
                                        />
                                    </div>
                                    <div className="form-outline mb-4">
                                        <input
                                            className="form-control"
                                            placeholder="Enter Cost"
                                            name="cost"
                                            value={activity.cost}
                                            onChange={handleChange}
                                            style={{ backgroundColor: '#FFFFFF' }}
                                        />
                                    </div>
                                    <div className="text-center text-lg-start mt-4 pt-2">
                                        <button className="btn btn-primary" type="submit" style={{ backgroundColor: '#24FF00', borderColor: '#24FF00' }}>Update Activity</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default EditActivity;
