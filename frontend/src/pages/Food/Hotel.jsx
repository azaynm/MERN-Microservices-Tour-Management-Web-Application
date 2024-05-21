import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hotel = () => {
    const hotels = [
        { name: 'Hotel 1', value: '1', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo0sTQ0PDxxm21LZ6k2-nw1SVtEmmz_7j9BsYlLKVUSw&s' },
        { name: 'Hotel 2', value: '2', image: 'https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=' },
        { name: 'Hotel 3', value: '3', image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/102283740.jpg?k=38ae0a303239e5af333a22a27b98961b512a8d4a08a9af18697238a5add7ba74&o=&hp=1' },
        { name: 'Hotel 4', value: '4', image: 'https://img.freepik.com/premium-photo/minsk-belarus-august-2017-columns-guestroom-hall-reception-modern-luxury-hotel_97694-6572.jpg' },
    ];
    const navigate = useNavigate();

    return (
        <div className="d-flex justify-content-center flex-wrap">
            {hotels.map((hotel, index) => (
                <div key={index} className="card m-3" style={{ width: '200px', backgroundColor: '#FFEFCD' }}>
                    <img src={hotel.image} className="card-img-top" alt={hotel.name} style={{ height: '150px', objectFit: 'cover' }} />
                    <div className="card-body text-center">
                        <h5 className="card-title">{hotel.name}</h5>
                        <button className="btn btn-secondary" style={{ backgroundColor: '#FFDB8B', borderColor: '#FFDB8B' }} onClick={() => navigate('/select-cuisine', { state: { hotel, method:"view-foods" } })}>
                            Select Hotel
                        </button>
                    </div>
                </div>
            ))}
        </div>


    );
};

export default Hotel;
