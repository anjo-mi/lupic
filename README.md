# PiKwik

**Making a Picnic Out of Picking**

PiKwik is a collaborative food ordering application built with Node.js and Express. It allows groups to coordinate restaurant selections, place individual orders, and manage group food orders efficiently.

---

## 📋 Project Overview

PiKwik streamlines the group food ordering process by providing:
- **User Authentication**: Secure signup/login system
- **Group Management**: Create or join food ordering groups
- **Restaurant Selection**: Daily restaurant selection by group members
- **Individual Ordering**: Place personal orders within the group selection
- **Order History**: Track previous orders and reorder favorites
- **Order Placement**: Coordinate final group orders for restaurant submission

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <https://github.com/anjo-mi/lupic>
   cd pikwik
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=2121
   DB_STRING=your_mongodb_connection_string
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the app**
   Open your browser to `http://localhost:2121`

---

## Testing
```bash
npm run test:e2e
```

---

## 🛠 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **Passport.js** - Authentication middleware
- **bcrypt** - Password hashing
- **express-session** - Session management
- **connect-mongo** - MongoDB session store

### Frontend
- **EJS** - Templating engine
- **CSS3** - Styling with CSS variables and themes
- **JavaScript** - Client-side interactivity
- **Responsive Design** - Mobile-friendly interface

### Development Tools
- **nodemon** - Development server
- **morgan** - HTTP request logger
- **express-flash** - Flash messages
- **validator** - Input validation

---

## 🔗 API Endpoints

### Authentication Routes (`/`)
- `GET /` - Landing page
- `GET /login` - Login page
- `POST /login` - Process login
- `GET /signup` - Signup page
- `POST /signup` - Process registration
- `GET /logout` - User logout

### Group Routes (`/groups`)
- `GET /groups` - View all groups and join/create interface
- `POST /groups/createGroup` - Create new group
- `POST /groups/joinGroup` - Join existing group

### Group Home Routes (`/groupHome`)
- `GET /groupHome` - Group management dashboard
- `POST /groupHome/submitChoice` - Submit daily restaurant selection
- `POST /groupHome/addExistingRestaurant` - Add restaurant to group
- `POST /groupHome/addNewRestaurant` - Create and add new restaurant

### Order Routes (`/orders`)
- `GET /orders` - Individual order management
- `POST /orders/submitOrder` - Submit personal order
- `POST /orders/changeRestaurant` - Change daily restaurant selection

### Placement Routes (`/placement`)
- `GET /placement` - Group order placement interface
- `POST /placement/placeOrders` - Submit orders to restaurant

---

## 📊 Database Schema

### User Model
- `userName` - Display name
- `email` - Login credential
- `password` - Hashed password
- `group` - Reference to user's group

### Group Model
- `name` - Group identifier
- `restaurants` - Array of available restaurants
- `selector` - Daily restaurant selector
- `selection` - Current restaurant selection

### Restaurant Model
- `name` - Restaurant name
- `menu` - Menu URL
- `phone` - Contact number
- `address` - Location

### Order Model
- `user` - Order owner
- `group` - Associated group
- `restaurant` - Selected restaurant
- `order` - Order details
- `notes` - Special instructions
- `placed` - Submission status

---

## ✨ Current Features

- 🔐 **User Authentication** - Secure login/signup system
- 👥 **Group Management** - Create and join ordering groups
- 🏪 **Restaurant Management** - Add and manage restaurant options
- 📅 **Daily Selection** - Rotate restaurant selection responsibility
- 🛒 **Individual Ordering** - Place personal orders within group selection
- 📋 **Order History** - View and reorder from previous orders
- 🎨 **Dark/Light Theme** - Toggle between visual themes
- 📱 **Responsive Design** - Mobile-friendly interface
- 🎠 **Interactive Carousels** - Navigate through options easily

---

## 🔮 Future Feature Ideas

### Enhanced User Experience
- **Real-time Notifications** - WebSocket integration for live updates
- **Order Status Tracking** - Track order preparation and delivery
- **Mobile App** - React Native or Flutter mobile application
- **Push Notifications** - Order reminders and status updates

### Advanced Ordering Features
- **Recurring Orders** - Schedule regular group orders
- **Budget Management** - Set spending limits and track expenses
- **Split Billing** - Automatic cost splitting and payment integration
- **Dietary Filters** - Filter restaurants by dietary restrictions
- **Rating System** - Rate restaurants and orders

### Group Management
- **Admin Roles** - Enhanced group administration features
- **Group Analytics** - Ordering patterns and spending insights
- **Multiple Groups** - Allow users to join multiple groups
- **Group Chat** - Built-in messaging for coordination

### Restaurant Integration
- **API Integration** - Connect with restaurant ordering systems
- **Menu Scraping** - Automatic menu updates
- **Delivery Tracking** - Real-time delivery status
- **Restaurant Partnerships** - Special pricing for groups

### Technical Improvements
- **Caching** - Redis integration for better performance
- **Email Notifications** - Order confirmations and reminders
- **Data Export** - Export order history and analytics
- **API Documentation** - Swagger/OpenAPI documentation
- **Testing Suite** - Comprehensive unit and integration tests






