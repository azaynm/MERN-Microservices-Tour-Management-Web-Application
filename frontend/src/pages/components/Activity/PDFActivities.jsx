import React, { useEffect, useState } from "react";
import axios from 'axios';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { PDFDownloadLink } from '@react-pdf/renderer';

// Define API_BASE
const API_BASE = "http://localhost:4000";



const PDFActivities = ({orderId}) => {

    
    const [purchasedActivities, setPurchasedActivities] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    

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
    
    
    

    const fetchPurchasedActivities = async () => {
        try {
            const response = await axios.get(`${API_BASE}/activity/purchased-activities/purchased-activities/get-activities/${orderId}`);
            console.log(response.data.purchasedActivities)
            return response.data.purchasedActivities;
        } catch (error) {
            console.error('Error fetching cuisines:', error);
            throw new Error('Failed to fetch cuisines');
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchPurchasedActivities(orderId)
            .then(data => {
                setPurchasedActivities(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
            });
    }, []);

    

    const handleGeneratePDF = () => {
        // Create a PDF document using @react-pdf/renderer
        const pdfContent = (
            <Document>
                <Page size="A4">
                    <View style={styles.container}>
                        <Text style={styles.title}>Purchased Activities:</Text>
                        <View style={styles.orderInfo}>
                            {purchasedActivities && (
                                <>
                                    <Text style={styles.info}>Date: {getDate(purchasedActivities.orderedDate)}</Text>
                                    <Text style={styles.info}>Total: {purchasedActivities.total}</Text>
                                </>
                            )}
                        </View>
                        {purchasedActivities && purchasedActivities.activities && purchasedActivities.activities.map((activity, index) => (
                            <View key={index} style={styles.item}>
                                <Text style={styles.name}>Name: {activity.name}</Text>
                                <Text style={styles.description}>Description: {activity.description}</Text>
                                <Text style={styles.price}>Hotel Id: {activity.hotelId}</Text>
                                <Text style={styles.price}>Start Time: {getDate(activity.startTime)}</Text>
                                <Text style={styles.price}>End Time: {getDate(activity.endTime)}</Text>
                                <Text style={styles.price}>Participants Count: {activity.participantsCount}</Text>

                                <Text style={styles.count}>Cost Per Person: Rs.{activity.cost}</Text>
                                <Text style={styles.count}>Total Cost: Rs.{activity.totalCost}</Text>
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
            
            <PDFDownloadLink document={handleGeneratePDF()} fileName="purchased_activities.pdf">
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
    item: {
        marginBottom: '20px',
        border: '1px solid #ccc',
        padding: '10px',
    },
    name: {
        fontWeight: 'bold',
    },
    description: {
        fontStyle: 'italic',
    },
    price: {
        marginBottom: '5px',
    },
    count: {
        marginBottom: '5px',
    }

    
});

export default PDFActivities;
