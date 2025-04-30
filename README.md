# Finance Tracker - MERN Stack Personal Finance Management App

## Overview

Finance Tracker is a comprehensive personal finance management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). The application helps users track their income and expenses, providing insightful visualizations and analytics to make informed financial decisions.

## Features

### Authentication
- Secure user registration and login
- JWT-based authentication
- Password encryption
- Protected routes
- User profile with image upload capability

### Dashboard
- Financial overview with total income, expenses, and balance
- Last 30 days expense summary
- Recent transactions list
- Income vs. Expense comparison
- Multiple visualization types (pie charts, bar graphs, line charts)

### Transaction Management
- Add, edit, and delete income entries
- Add, edit, and delete expense entries
- Categorize transactions
- Add transaction dates
- Add notes to transactions
- Add icons for different categories

### Reports and Exports
- Download income history as Excel files
- Download expense history as Excel files
- Filter transactions by date range, category, or amount

## Tech Stack

### Frontend
- React.js
- Redux for state management
- Chart.js for data visualization
- Material UI / Tailwind CSS for styling
- Axios for HTTP requests

### Backend
- Node.js
- Express.js
- MongoDB for database
- Mongoose for ODM
- JWT for authentication

## Installation

### Prerequisites
- Node.js (v14.0.0 or later)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/yourusername/finance-tracker.git
cd finance-tracker
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Configure environment variables
   
Create a `.env` file in the server directory with the following variables:
```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Create a `.env` file in the client directory:
```
REACT_APP_API_URL=http://localhost:8000
```

4. Run the application
```bash
# Run backend server
cd server
npm run dev

# In a new terminal, run frontend
cd client
npm start
```

The application should now be running at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login and get authentication token
- `POST /api/v1/auth/register` - Register a new user
- `GET /api/v1/auth/getuser` - Get user information
- `POST /api/v1/auth/upload-image` - Upload user profile image

### Dashboard
- `GET /api/v1/dashboard` - Get dashboard data including visualizations and financial overview

### Income
- `POST /api/v1/income/add` - Add a new income transaction
- `GET /api/v1/income/getall` - Get all income transactions
- `DELETE /api/v1/income/:incomeId` - Delete a specific income transaction
- `GET /api/v1/income/downloadexcel` - Download income transactions as Excel file

### Expense
- `POST /api/v1/expense/add` - Add a new expense transaction
- `GET /api/v1/expense/getall` - Get all expense transactions
- `DELETE /api/v1/expense/:expenseId` - Delete a specific expense transaction
- `GET /api/v1/expense/downloadexcel` - Download expense transactions as Excel file



## Screenshots

![image](https://github.com/user-attachments/assets/7301d277-1265-4836-96c7-8acc6610df14)
![image](https://github.com/user-attachments/assets/ca662216-d6a0-4b30-b6c5-a16f289f45df)
![image](https://github.com/user-attachments/assets/a24cdf6f-d7cf-4400-9f9c-f66a201f3625)




## Future Enhancements
- Budget planning and tracking
- Bill reminders and recurring transactions
- Financial goals setting and tracking
- Multi-currency support
- Mobile application

## Contributors
- [Your Name](https://github.com/Itsmevedant145
