import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Inputs from '../../components/layouts/inputs/Inputs';
import { validemail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';
import { API_Path } from '../../utils/apiPath';
import { UserContext } from '../../context/UserContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, QCsetShowPassword] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handle_login = async (e) => {
    e.preventDefault();

    if (!validemail(email)) {
      setError('Invalid email format');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(API_Path.AUTH.LOGIN, { email, password });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        
        // Only update user context if user data is provided
        if (user) {
          updateUser(user);
        }
        // If no user data, UserContext will automatically fetch it
        
        navigate("/dashboard");
      } else {
        setError("Login failed: No token received");
      }
    } catch (error) {
      setError(
        error?.response?.data?.message || 'An error occurred. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md w-full mx-auto p-8 bg-white shadow-md rounded-md">
        <h3 className="text-2xl font-bold text-zinc-800 mb-2">Welcome Back</h3>
        <p className="text-zinc-600 mb-6">Please enter your details to continue</p>

        <form onSubmit={handle_login} className="space-y-4">
          <Inputs
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            placeholder="Enter your email"
            type="email"
          />
          <Inputs
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Minimum 8 characters"
            type={showPassword ? 'text' : 'password'}
          />

          {error && <p className="text-blue-600 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-400 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-sm text-zinc-600 mt-4">
            Don't have an account?
          </p>
          <Link
            to="/signUp"
            className="block text-center text-blue-600 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;