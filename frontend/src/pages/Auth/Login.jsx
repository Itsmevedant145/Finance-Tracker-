
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Inputs from '../../components/layouts/inputs/Inputs';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import './Login.css';
import { validemail } from '../../utils/helper'; // Assuming you have a validation function
import axiosInstance from '../../utils/axiosinstance';
import { API_Path } from '../../utils/apiPath';
import { UserContext } from '../../context/UserContext'; // Assuming you have a UserContext
 // Assuming you have an API_PATHS object

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

 const [isLoading, setIsLoading] = useState(false);
 const [showPassword, setShowPassword] = useState(false);
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
      const response = await axiosInstance.post(API_Path.AUTH.LOGIN, {
        email,
        password,
      });
  
      const { token, user } = response.data;
  
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);

        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  
  return (
    <AuthLayout>
      <div className="container">
        <h3 className="greetingmessage">Welcome Back</h3>
        <p className="instructions">Please enter your details to continue</p>
        
        <form onSubmit={handle_login}>
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
        type={showPassword ? 'text' : 'password'} // 👈 dynamic type
      />

          
          {error && <p className="error-message">{error}</p>}
          
          <button 
            type="submit" 
            className="loginbtn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          
          <p className="donthaveaccounttext">
            Don't have an account?
          </p>
          
          <Link to="/signUp" className="signupbtn">
            Sign Up
          </Link>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;