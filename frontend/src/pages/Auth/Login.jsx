import React, { useState, useContext } from 'react';
import { Lock } from 'lucide-react'; 
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

        if (user) {
          updateUser(user);
        }

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
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            Welcome Back! 👋
          </h2>
          <p className="text-gray-600 text-sm lg:text-base">
            Ready to manage your expenses?
          </p>
        </div>

        <form onSubmit={handle_login} className="space-y-5">
          <div className="space-y-4">
            <Inputs
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              icon="📧"
            />

            {/* ✅ Fixed: Using Lock icon instead of Eye */}
            <Inputs
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Enter your password"
              type="password"
              icon={<Lock className="w-5 h-5" />}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm font-medium flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center space-y-3">
            <p className="text-gray-600 text-sm">
              Don't have an account?
            </p>
            <Link
              to="/signUp"
              className="inline-flex items-center justify-center w-full py-2 px-4 border-2 border-gray-200 rounded-xl text-gray-700 hover:border-indigo-300 hover:text-indigo-600 font-medium transition-all duration-200 hover:bg-indigo-50"
            >
              Create Account ✨
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;