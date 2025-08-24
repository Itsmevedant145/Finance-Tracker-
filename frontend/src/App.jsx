import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/DashBoard/Home';
import Income from './pages/DashBoard/Income';
import Expense from './pages/DashBoard/Expense';
import RecurringTransactions from './components/RecurringTransactions/RecurringTransactions';

import { UserProvider } from './context/UserContext';
import ProtectedRoute from './context/ProtectedRoute'; // import the ProtectedRoute

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />

          {/* Protected routes wrapped by ProtectedRoute */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expense" element={<Expense />} />
            {/* <Route path="/recurring-transactions" element={<RecurringTransactions />} /> */}
          </Route>

          {/* Catch-all route to redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </UserProvider>
  );
}

export default App;
