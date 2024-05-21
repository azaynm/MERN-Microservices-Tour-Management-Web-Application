import React, { useEffect, useState } from 'react';
import './Menu.css';
import axios from 'axios';
import MenuCategory from '../components/Food/MenuCategory';




const Menu = () => {
    const API_BASE = "http://localhost:4000";
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('tab1'); // State to manage active tab

    const tabDetails = [
        { id: 'tab1', name: 'Hotel 1', hotelId: '1' }, // Example tab without category
        { id: 'tab2', name: 'Hotel 2', hotelId: '2' },
        { id: 'tab3', name: 'Hotel 3', hotelId: '3' },
        { id: 'tab4', name: 'Hotel 4', hotelId: '4' },
        // Add more tabs as needed
    ];
    return (
    
            <div className="form-container">
                
                <div className="tabs">
                    {tabDetails.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab btn btn-primary mx-2 ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>
                <div className="tab-content">
                    {tabDetails.map(tab => (
                        <div key={tab.id}>
                            {activeTab === tab.id && (
                                <MenuCategory hotelId={tab.hotelId} />
                            )}
                        </div>
                    ))}
                </div>

            </div>
       
    );
}

export default Menu;
