import React, { useEffect, useState } from "react";
import axios from 'axios';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { PDFDownloadLink } from '@react-pdf/renderer';

// Define API_BASE
const API_BASE = "http://localhost:4000";



const PDFFoods = ({orderId}) => {

    
    const [orderedFoods, setOrderedFoods] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    

    function getDate() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        return `${month}/${date}/${year}`;
    }

    const fetchOrderedFoods = async () => {
        try {
            const response = await axios.get(`${API_BASE}/food/ordered/ordered-foods/get-foods/${orderId}`);
            return response.data.orderedFoods;
        } catch (error) {
            console.error('Error fetching cuisines:', error);
            throw new Error('Failed to fetch cuisines');
        }
    };

    useEffect(() => {
       
        setIsLoading(true);
        fetchOrderedFoods()
            .then(data => {
                setOrderedFoods(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
            });
    }, []);

    
    function getDate(date) {
        const today = new Date(date);
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const day = today.getDate();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
    
        // Convert hours to AM/PM format
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
    
        // Add leading zero if minutes or seconds are less than 10
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    
        return `${month}/${day}/${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    }

    

    const handleGeneratePDF = () => {
        // Create a PDF document using @react-pdf/renderer
        const pdfContent = (
            <Document>
                <Page size="A4">
                    <View style={styles.container}>
                        <Text style={styles.title}>Ordered Foods:</Text>
                        <View style={styles.orderInfo}>
                            {orderedFoods && (
                                <>
                                    <Text style={styles.info}>Date: {getDate(orderedFoods.orderedDate)}</Text>
                                    <Text style={styles.info}>Total: {orderedFoods.total}</Text>
                                </>
                            )}
                        </View>
                        {orderedFoods && orderedFoods.foods && orderedFoods.foods.map((food, index) => (
                            <View key={index} style={styles.foodItem}>
                                <Text style={styles.foodName}>Name: {food.name}</Text>
                                <Text style={styles.foodDescription}>Description: {food.description}</Text>
                                <Text style={styles.foodPrice}>Price: Rs.{food.price}</Text>
                                <Text style={styles.foodQuantity}>Quantity: {food.quantity}</Text>
                                <Text style={styles.foodIngredients}>Ingredients: {food.ingredients.join(', ')}</Text>
                            </View>
                        ))}
                    </View>
                </Page>
            </Document>
        );
    
        // Return the PDF content
        return pdfContent;
    };
    

    return (
        <div>
            
            <PDFDownloadLink document={handleGeneratePDF()} fileName="ordered_foods.pdf">
                {({ blob, url, loading, error }) =>
                    loading ? 'Loading document...' : 'Download PDF'
                }
            </PDFDownloadLink>
        </div>
    );
    
}


const styles = StyleSheet.create({
    container: {
        margin: '20px',
        padding: '20px',
        
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    orderInfo: {
        marginBottom: '20px',
    },
    info: {
        marginBottom: '5px',
    },
    foodItem: {
        marginBottom: '20px',
        border: '1px solid #ccc',
        padding: '10px',
    },
    foodName: {
        fontWeight: 'bold',
    },
    foodDescription: {
        fontStyle: 'italic',
    },
    foodPrice: {
        marginBottom: '5px',
    },
    foodQuantity: {
        marginBottom: '5px',
    },
    foodIngredients: {
        fontStyle: 'italic',
    },

    
});

export default PDFFoods;
