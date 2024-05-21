

import './App.css';



import { Routes, Route, BrowserRouter, useNavigate, Navigate } from "react-router-dom";
import { useState } from 'react';
import FoodDashboard from './pages/Food/FoodDashboard';
import AddFood from './pages/Food/AddFoods';
import ViewEditFood from './pages/Food/ViewEditFood';
import EditFood from './pages/Food/EditFood';
import Cuisine from './pages/Food/Cuisine';
import Hotel from './pages/Food/Hotel';
import SelectHotel from './pages/Food/SelectHotel';
import ViewFoods from './pages/Food/ViewFoods';
import PDFActivities from './pages/components/Activity/PDFActivities';
import ViewFoodOrders from './pages/Food/ViewFoodOrders';
import PDFFoods from './pages/components/Food/PDFFoods';
import Menu from './pages/Food/Menu';
import ActivityDashboard from './pages/Activity/ActivityDashboard';
import AddActivity from './pages/Activity/AddActivity';
import SelectAddActivityHotel from './pages/Activity/SelectAddActivityHotel';
import ViewActivities from './pages/Activity/ViewActivities';
import ViewEditActivity from './pages/Activity/ViewEditActivity';
import EditActivity from './pages/Activity/EditActivity';
import ViewPurchasedActivities from './pages/Activity/ViewPurchasedActivities';
import Finalize from './pages/Activity/Finalize';





function App() {

  const [categories, setCategories] = useState(["Entrees", "Appetizers", "SideDishes", "Salads", "Soups", "Desserts", "Beverages", "Specials"]);

  return (
    <BrowserRouter>


      <Routes>
        <Route path='/food-dashboard' element={
          <FoodDashboard />
        } />
        <Route path='/add-food' element={
          <AddFood categories={categories} />
        } />
        <Route path='/view-edit-food' element={
          <ViewEditFood />
        } />
        <Route path='/edit-food' element={
          <EditFood />
        } />
        <Route path='/select-cuisine' element={
          <Cuisine />
        } />
        <Route path='/hotel' element={
          <Hotel />
        } />
        <Route path='/select-hotel' element={
          <SelectHotel />
        } />
        <Route path='/view-foods' element={
          <ViewFoods />
        } />
        <Route path='/generate-activities-pdf' element={
          <PDFActivities />
        } />

        <Route path='/view-food-orders' element={
          <ViewFoodOrders />
        } />

        <Route path='/generate-foods-pdf' element={
          <PDFFoods />
        } />
        <Route path='/menu' element={
          <Menu />
        } />


        <Route path='/activity-dashboard' element={
          <ActivityDashboard />
        } />
        <Route path='/add-activity' element={
          <AddActivity />
        } />
        <Route path='/select-add-activity-hotel' element={
          <SelectAddActivityHotel />
        } />
        <Route path='/view-activities' element={
          <ViewActivities />
        } />
        <Route path='/view-edit-activity' element={
          <ViewEditActivity />
        } />
        <Route path='/edit-activity' element={
          <EditActivity />
        } />
         <Route path='/purchased-activities' element={
          <ViewPurchasedActivities />
        } />


        <Route path='/finalize' element={
          <Finalize />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
