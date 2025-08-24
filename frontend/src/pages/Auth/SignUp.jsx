import React, { useState, useContext } from 'react';
import { validemail } from '../../utils/helper';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Inputs from '../../components/layouts/inputs/Inputs';
import ProfilePhotoselector from '../../components/layouts/inputs/ProfilePhotoselector';
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
  const [showPassword, setShowPassword] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!fullname.trim()) {
      setError('Full name is required');
      setIsLoading(false);
      return;
    }

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
        ...(profileImageUrl && { profileImageUrl }),
      };

      const response = await axiosInstance.post(API_Path.AUTH.REGISTER, signupPayload);
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser?.(user);
        navigate('/dashboard');
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            Join Us Today! 🚀
          </h2>
          <p className="text-gray-600 text-sm lg:text-base">
            Start your journey to financial freedom
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Profile section */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="flex-1">
              <Inputs
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                label="Full Name"
                placeholder="Enter your full name"
                type="text"
                icon="👤"
              />
            </div>
            <div className="flex-shrink-0 self-center sm:self-end">
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <ProfilePhotoselector image={profilepic} setImage={setProfilepic} />
              </div>
            </div>
          </div>

          <Inputs
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            icon="📧"
          />

          <div className="relative">
            <Inputs
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Minimum 8 characters"
              type={showPassword ? 'text' : 'password'}
              icon="🔒"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
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
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center space-y-3">
            <p className="text-gray-600 text-sm">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-2 px-4 border-2 border-gray-200 rounded-xl text-gray-700 hover:border-purple-300 hover:text-purple-600 font-medium transition-all duration-200 hover:bg-purple-50"
            >
              Sign In Instead 👋
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignUp;