import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PDFActivities from '../components/Activity/PDFActivities';


const ViewPurchasedActivities = () => {
    const API_BASE = "http://localhost:4000";
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const loggedUser = "cus1";

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE}/activity/purchased-activities/get-orders/${loggedUser}`);
            setOrders(response.data);
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="container">
            <h2>View Purchased Activities</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Ordered Date</th>
                            <th>Total</th>
                            <th>Download Report</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{new Date(order.orderedDate).toLocaleString()}</td>
                                <td>{order.total}</td>
                                <td><PDFActivities orderId={order._id} /></td> {/* Pass orderId to PDFFoods component */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ViewPurchasedActivities;
