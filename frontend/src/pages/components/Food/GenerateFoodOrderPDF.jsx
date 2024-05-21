import axios from 'axios';
import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { View } from '@react-pdf/renderer';

const API_BASE = "http://localhost:4000";

const GenerateFoodOrderPDF = async() => {
    try {
        const response = await axios.get(`${API_BASE}/food/ordered/ordered-foods/get-foods/${orderId}`);
        console.log(response.data.orderedFoods)
        return response.data.orderedFoods;
    } catch (error) {
        console.error('Error fetching cuisines:', error);
        throw new Error('Failed to fetch cuisines');
    }
};

useEffect(() => {
    const orderId = "65fbbfef37d24dde1ea69574"; // Provide the actual hotelId here
    setIsLoading(true);
    fetchOrderedFoods(orderId)
        .then(data => {
            setOrderedFoods(data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error(error);
            setIsLoading(false);
        });
}, []);

const generatePDF = () => {
    const content = document.getElementById('pdf-content');

    // Wait for images to load
    const images = content.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img =>
        new Promise(resolve => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = resolve;
            }
        })
    );

    Promise.all(imagePromises).then(() => {
        // All images are loaded, proceed to capture the content
        html2canvas(content).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'JPEG', 0, 0);
            pdf.save('order_details.pdf');
        });
    });
};


const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // You can adjust the format as needed
}


return (
    <div>
    <Document>
        <Page size="A4">
            <View>
                <Text>{orderedFoods.customerId}</Text>
                <Text>{orderedFoods.total}</Text>
                <Text>{formatDate(orderedFoods.orderedDate)}</Text>
            </View>

            {orderedFoods.foods && orderedFoods.foods.map((food, index) => (
                <View>
                    <Text>{food.name}</Text>
                    < Text > {food.description}</Text>
                    <Text>{food.ingredients && food.ingredients.join(', ')}</Text>
                    <Text>{food.hotelId}</Text>
                    <Text>{food.price}</Text>
                    <Text>{food.quantity}</Text>
                </View>
            ))}

            < Text >*** This is a computer generated document which does not need a signature ***</Text>
            <Text>Make payment conveniently - Thank You!</Text>

        </Page >
    </Document >
                <button onClick={generatePDF}>GENERATE PDF</button>
    </div>

);

export default GenerateFoodOrderPDF;
