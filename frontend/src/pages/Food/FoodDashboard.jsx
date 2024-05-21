import React from 'react';
import { useNavigate } from 'react-router-dom';

const FoodDashboard = () => {

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
                            <button className="btn btn-success mr-3" onClick={() => navigate('/hotel', { state: { method: "view-food" } })}> View Activity</button>
                                <button className="btn btn-success mr-3" onClick={()=>navigate('/select-hotel', { state: { method:"add-food"  }})}>Add Food</button>
                                <button className="btn btn-warning mr-3" onClick={()=>navigate('/select-hotel', { state: { method:"view-edit-food"  }})}>Modify Food</button>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FoodDashboard;
