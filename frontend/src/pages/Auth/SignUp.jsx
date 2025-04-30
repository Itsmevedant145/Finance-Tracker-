import React, { useState, useContext } from 'react';
import { validemail } from '../../utils/helper';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Inputs from '../../components/layouts/inputs/Inputs';
import ProfilePhotoselector from '../../components/layouts/inputs/ProfilePhotoselector';
import './SignUp.css';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axiosinstance';
import { API_Path } from '../../utils/apiPath';
import uploadImage from '../../utils/uploadImage';

function SignUp() {
  const [profilepic, setProfilepic] = useState(null);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext); // ✅ FIXED: match context
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Frontend validations
    if (!validemail(email)) {
      setError('Invalid email format');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      let profileImageUrl = '';

      if (profilepic) {
        const imgUploadRes = await uploadImage(profilepic);
        profileImageUrl = imgUploadRes.imageUrl || '';
      }

      const signupPayload = {
        fullname,
        email,
        password,
      };

      if (profileImageUrl) {
        signupPayload.profileImageUrl = profileImageUrl;
      }

      console.log('🚀 Sending Signup Payload:', signupPayload);

      const response = await axiosInstance.post(API_Path.AUTH.REGISTER, signupPayload);

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        if (typeof updateUser === 'function') {
          updateUser(user);
        }
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const backendMessage =
          error.response.data.message || 'Something went wrong. Please try again.';
        setError(backendMessage);
      } else {
        setError('Network or server error. Please try again later.');
      }
      console.error('❌ Signup Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bigger">
        <div className="createcommnad">Create an account</div>
        <div className="createcommnad2">Please enter your details to continue</div>

        <form onSubmit={handleSignup}>
          <div className="inner">
            {/* Name and Photo */}
            <div className="name-photo-container">
              <div className="name-container">
                <Inputs
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  label="Full Name"
                  placeholder="Enter your full name"
                  type="text"
                />
              </div>
              <div className="photo-container">
                <ProfilePhotoselector image={profilepic} setImage={setProfilepic} />
              </div>
            </div>

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
              type="password"
            />

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>

            <Link to="/login" className="signupbtn">
              Login
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignUp;
