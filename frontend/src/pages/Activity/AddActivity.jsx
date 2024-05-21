import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import FormData from 'form-data';
import { useLocation } from 'react-router-dom';

const API_BASE = "http://localhost:4000";

const AddActivity = ({ categories }) => {
    const [formErrors, setFormErrors] = useState({});
    
    const location = useLocation();
    const { hotel } = location.state;
    
    const [file, setFile] = useState(null);
    const [newActivity, setNewActivity] = useState({
        name: '',
        description: '',
        startTime: '',
        endTime: '',
        participantsCount: '',
        cost: '',
        hotelId: hotel.value,
        image: ''
    });

    const handleChange = ({ target }) => {
        setNewActivity({ ...newActivity, [target.name]: target.value });
    }

    const handlePhoto = ({ target }) => {
        setFile(URL.createObjectURL(target.files[0]));
        setNewActivity({ ...newActivity, image: target.files[0] });
        console.log(newActivity.image);
    }

    const validateForm = () => {
        let errors = {};
        let formIsValid = true;
    
        // Name validation
        if (!newActivity.name) {
            errors.name = 'Name is required';
            formIsValid = false;
        }
    
        // Description validation
        if (!newActivity.description) {
            errors.description = 'Description is required';
            formIsValid = false;
        }
    
        // Start Time validation
        if (!newActivity.startTime) {
            errors.startTime = 'Start Time is required';
            formIsValid = false;
        }
    
        // End Time validation
        if (!newActivity.endTime) {
            errors.endTime = 'End Time is required';
            formIsValid = false;
        }
    
        // Participants Count validation
        if (!newActivity.participantsCount) {
            errors.participantsCount = 'Participants Count is required';
            formIsValid = false;
        }
    
        // Cost validation
        if (!newActivity.cost) {
            errors.cost = 'Cost is required';
            formIsValid = false;
        }
    
        setFormErrors(errors); // Update state with errors
        return formIsValid;
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        const formData = new FormData();
        formData.append('name', newActivity.name);
        formData.append('description', newActivity.description);
        formData.append('startTime', newActivity.startTime);
        formData.append('endTime', newActivity.endTime);
        formData.append('participantsCount', newActivity.participantsCount);
        formData.append('cost', newActivity.cost);
        formData.append('hotelId', newActivity.hotelId);
        formData.append('image', newActivity.image);

        console.log(newActivity.image);

        await Swal.fire({
            title: 'Do you want to add this activity?',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Add',
            denyButtonText: `Cancel`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire('Activity Added!', '', 'success')
                try {
                    const res = await axios.post(`${API_BASE}/activity/upload`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    console.log(res);
                    setNewActivity({
                        name: '',
                        description: '',
                        startTime: '',
                        endTime: '',
                        participantsCount: '',
                        cost: '',
                        image: ''
                    });
                    setFile(null);
                } catch (error) {
                    console.log(error);
                }
            } else if (result.isDenied) {
                Swal.fire('Error Occured', '', 'info')
            }
        });
    }

    return (
        <div className="container">
    <h2 className="mt-5 mb-4">Add New Activity</h2>
    <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label className="form-label">Name:</label>
            <input type="text" className="form-control" name="name" value={newActivity.name} onChange={handleChange}  />
            <div className="text-danger">{formErrors.name}</div>
        </div>
        <div className="mb-3">
            <label className="form-label">Description:</label>
            <textarea className="form-control" name="description" value={newActivity.description} onChange={handleChange} ></textarea>
            <div className="text-danger">{formErrors.description}</div>
        </div>
        <div className="mb-3">
            <label className="form-label">Start Time:</label>
            <input type="datetime-local" className="form-control" name="startTime" value={newActivity.startTime} onChange={handleChange}  />
            <div className="text-danger">{formErrors.startTime}</div>
        </div>
        <div className="mb-3">
            <label className="form-label">End Time:</label>
            <input type="datetime-local" className="form-control" name="endTime" value={newActivity.endTime} onChange={handleChange}  />
            <div className="text-danger">{formErrors.endTime}</div>
        </div>
        <div className="mb-3">
            <label className="form-label">Participants Count:</label>
            <input type="number" className="form-control" name="participantsCount" value={newActivity.participantsCount} onChange={handleChange}  />
            <div className="text-danger">{formErrors.participantsCount}</div>
        </div>
        <div className="mb-3">
            <label className="form-label">Cost:</label>
            <input type="number" className="form-control" name="cost" value={newActivity.cost} onChange={handleChange}  />
            <div className="text-danger">{formErrors.cost}</div>
        </div>
        
        <div className="mb-3">
            <label className="form-label">Image:</label>
            <input type="file" className="form-control" name="image" onChange={handlePhoto} />
        </div>
        <button type="submit" className="btn btn-primary">Add Activity</button>
    </form>
</div>

    );
}

export default AddActivity;
