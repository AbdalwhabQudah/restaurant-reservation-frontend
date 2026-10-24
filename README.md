# Restaurant Reservation & Management System — Frontend

React frontend for the Restaurant Reservation & Management System.

The application provides a responsive interface for restaurant customers and administrators.

---

# Technologies

- React.js
- Vite
- Material UI
- React Router
- Axios
- Leaflet
- OpenStreetMap
- Git/GitHub

---

# User Roles

The application contains two roles:

## Customer

Customers can:

- Register
- Login
- Browse the restaurant menu
- Filter menu categories
- Check table availability
- Make reservations
- View their reservations
- Edit eligible reservations
- Cancel reservations
- View reservation history
- Update their profile

## Admin

Admins can:

- Login
- View dashboard statistics
- View all reservations
- Update reservation status
- Manage menu items
- Manage restaurant tables
- View registered customers

---

# Main Pages

The application contains six main pages:

```text
Home
Menu
Reservation
Login / Register
Customer Dashboard
Admin Dashboard
```

---

# Project Structure

```text
src/
│
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── MenuCard.jsx
│   ├── ProtectedRoute.jsx
│   └── RestaurantMap.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── RestaurantContext.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Menu.jsx
│   ├── Reservation.jsx
│   ├── Auth.jsx
│   ├── CustomerDashboard.jsx
│   └── AdminDashboard.jsx
│
├── services/
│   └── api.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# Installation

Clone the repository:

```bash
git clone <FRONTEND_GITHUB_URL>
```

Enter the project:

```bash
cd restaurant-reservation-frontend
```

Install packages:

```bash
npm install
```

Run the application:

```bash
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

---

# Backend Requirement

The Express backend should also be running:

```text
http://localhost:5000
```

Frontend communication follows:

```text
React
 ↓
Axios
 ↓
Express REST API
 ↓
PostgreSQL
```

---

# API Configuration

Axios configuration is stored inside:

```text
src/services/api.js
```

During development the API base URL is:

```text
http://localhost:5000/api
```

The production URL should be configured when the backend is deployed.

---

# Authentication

Users log in through the frontend.

The frontend sends:

```http
POST /api/auth/login
```

The backend verifies the password and returns a JWT.

The JWT is stored in browser localStorage using:

```text
delish_token
```

Axios attaches it to protected API requests:

```http
Authorization: Bearer JWT_TOKEN
```

When the application reloads, the frontend uses:

```http
GET /api/auth/me
```

to restore the authenticated user.

---

# Authorization

Frontend protected routes prevent unauthorized navigation.

For example:

```text
Customer
→ Customer Dashboard ✅
→ Admin Dashboard ❌

Admin
→ Admin Dashboard ✅
```

The backend also performs authorization checks, meaning frontend restrictions cannot be bypassed by manually calling an API.

---

# Menu

The Menu page retrieves data from PostgreSQL through:

```http
GET /api/menu
```

The menu contains categories such as:

- Starters
- Main Dishes
- Desserts
- Drinks

React state is used to dynamically filter displayed menu items.

---

# Reservation Workflow

The Customer reservation workflow is:

```text
Customer
 ↓
Select date/time/guests
 ↓
Check availability
 ↓
Express searches PostgreSQL
 ↓
Available table selected
 ↓
Customer confirms
 ↓
Reservation stored as Pending
 ↓
Admin reviews reservation
 ↓
Confirmed / Rejected
 ↓
Customer dashboard updates
```

---

# Customer Dashboard

The Customer Dashboard displays:

- Upcoming reservations
- Reservation history
- Reservation status
- Profile information

Customers can:

- Edit eligible reservations
- Cancel reservations
- Update profile information

---

# Admin Dashboard

The Admin Dashboard contains:

```text
Overview
Reservations
Menu Management
Table Management
Customers
```

The Overview displays:

- Today's reservations
- Pending reservations
- Customer count
- Active table count
- Recent reservations

---

# Menu Management

Admins can perform CRUD operations:

```text
Create
Read
Update
Delete
```

on restaurant menu items.

Changes are sent to the Express backend and stored in PostgreSQL.

---

# Restaurant Table Management

Admins can:

- Add restaurant tables
- Update capacity
- Change Indoor/Outdoor location
- Activate/deactivate tables
- Delete tables without reservation history

---

# Third-Party Map Integration

The Home page contains an interactive restaurant location map using:

- Leaflet
- OpenStreetMap

The map allows users to:

- View restaurant location
- Zoom
- Move around the map
- View the restaurant marker

OpenStreetMap attribution is displayed as required by the map provider.

---

# Material UI

Material UI is used throughout the project to provide:

- Responsive layout
- Consistent components
- Cards
- Buttons
- Dialogs
- Tables
- Forms
- Navigation
- Mobile responsiveness

---

# Responsive Design

The application is designed for:

```text
Desktop
Laptop
Tablet
Mobile
```

Responsive layouts are implemented using Material UI breakpoints and flexible grids.

---

# Git Workflow

Frontend development uses feature branches such as:

```text
feature/frontend-ui
feature/backend-integration
feature/map-integration
```

Features are pushed to GitHub and merged through Pull Requests.

---

# Running the Complete System

Start PostgreSQL first.

Then start the backend:

```bash
cd restaurant-backend
npm run dev
```

Then start the frontend:

```bash
cd restaurant-frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# Main Full-Stack Architecture

```text
Browser
   ↓
React.js
   ↓ Axios / HTTP
Express.js
   ↓
PostgreSQL
```

Authentication adds:

```text
React
 ↓
Login request
 ↓
Express
 ↓
bcrypt
 ↓
PostgreSQL
 ↓
JWT
 ↓
React
```

---

# Security

The frontend does not directly connect to PostgreSQL.

All database operations are handled through the Express API.

Sensitive values such as:

- Database passwords
- JWT secrets

are stored only on the backend and are not included in frontend code.

---

# Authors

Developed for the Special Topics in Computer Science 1 full-stack web application assignment.