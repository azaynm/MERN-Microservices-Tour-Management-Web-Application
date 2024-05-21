import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActivityDashboard = () => {

    const navigate = useNavigate();

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card text-center">
                        <div className="card-header">
                            Food Dashboard
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <button className="btn btn-success mr-3" onClick={() => navigate('/select-add-activity-hotel', { state: { method: "view-activities" } })}> View Activity</button>
                                <button className="btn btn-success mr-3" onClick={() => navigate('/select-hotel', { state: { method: "add-activity" } })}>Add Activity</button>
                                <button className="btn btn-warning mr-3" onClick={() => navigate('/select-hotel', { state: { method: "view-edit-activity" } })}>Modify Activity</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActivityDashboard;
