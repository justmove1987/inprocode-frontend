# 🌐 InProCode Platform

A complete **React + Node.js + MongoDB** full-stack application for managing users, locations, events, and data visualizations on an interactive map and calendar.

## 📋 Features

✅ **User Management (CRUD)**  
✅ **Location-based map** using Leaflet  
✅ **Interactive calendar** with event creation and user association  
✅ **Data visualization** with Chart.js (line and bar charts)  
✅ **Dynamic city autocomplete** with OpenStreetMap  
✅ **Responsive UI** built with Tailwind CSS  
✅ **Persistent data storage** in MongoDB  
✅ **Live deployment** on Vercel

---

## 🚀 Live Demo

👉 [Access the live app](https://inprocode-frontend.vercel.app/)

---

## 📦 Tech Stack

- **Frontend**: React + Vite + TypeScript  
- **Backend**: Node.js + Express  
- **Database**: MongoDB (Mongoose)  
- **Map**: Leaflet with OpenStreetMap  
- **Calendar**: FullCalendar  
- **Charts**: Chart.js  
- **Deployment**: Vercel (Frontend)

---

## 🛠️ Local Installation

To run this project locally:

### 1. Clone the repository

```bash
git clone https://github.com/justmove1987/inprocode-backend.git
npm install
npm run start
```
This will start the backend server at http://localhost:3000

```bash
git clone https://github.com/justmove1987/inprocode-frontend.git
npm install
npm run start
```
This will start the frontend at http://localhost:5173

---


## 🌍 Application Structure
📄 Pages

/Users: Create, edit and delete users, including location and hobbies

/Mapa: Visualize user locations and custom points (restaurants, hotels, etc.)

/Calendar: Manage and associate events with registered users

/Grafics: Analyze user distribution by city with charts

---

# 🧪 Functionality Overview
## ✅ User Registration

Includes first name, last name, email, phone, hobby, and city (with autocomplete)

Automatically places the user on the map

Icon differentiates users from custom locations

---


## 🗺️ Map

Custom icons per category (restaurant, hotel, museum, user...)

Supports adding, editing, deleting points

Route visualization via connected points

Prevents overlapping user markers at same coordinates

---


## 📆 Calendar

Add events with time ranges

Assign events to specific users

Events are saved and persisted in MongoDB

---


## 📊 Charts

Line chart: can be adapted to show trends

Bar chart: shows number of users per city (based on current data)

---


## ⚙️ Environment Variables

For backend, create a .env file in /8-back-inprocode/ with:
```bash
MONGO_URI=your_mongodb_connection_string
PORT=3000
```
Replace your_mongodb_connection_string with your actual MongoDB URI

---


# 👨‍🏫 Project Purpose

This application was developed as a final React project for the React module at IT Academy, demonstrating integration of:

React component architecture

RESTful API design

Real-time UI interaction

External APIs (OpenStreetMap)

Advanced tools like FullCalendar and Leaflet

---


## 📚 Credits

Icons: Leaflet
, Heroicons

Maps: OpenStreetMap

Calendar: FullCalendar

Charts: Chart.js

---


## ✅ Author

Enric Abad Rovira
React Student at IT Academy — Final React Project
September 2025 