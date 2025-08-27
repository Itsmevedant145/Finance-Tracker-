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
import { User, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

function SignUp() {
  const [profilepic, setProfilepic] = useState(null);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Create Your Account
          </h2>
          <p className="text-gray-500 text-base lg:text-lg max-w-md mx-auto">
            Join thousands of users on their journey to financial freedom
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Profile Section */}
          <div className="bg-gray-50/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6 gap-4">
              <div className="flex-1">
                <Inputs
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  label="Full Name"
                  placeholder="Enter your full name"
                  type="text"
                  icon={<User className="w-5 h-5" />}
                />
              </div>
              <div className="flex-shrink-0 self-center sm:self-end">
                <div className="text-center">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Profile Photo
                  </label>
                  <ProfilePhotoselector image={profilepic} setImage={setProfilepic} />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-5">
            <Inputs
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
              icon={<Mail className="w-5 h-5" />}
            />

            <Inputs
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Create a strong password (min 8 characters)"
              type="password"
              icon={<Lock className="w-5 h-5" />}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl overflow-hidden"
          >
            {/* Button Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Your Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </div>
          </button>

          {/* Login Link */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          <Link
            to="/login"
            className="group flex items-center justify-center gap-2 w-full py-3 px-6 border-2 border-gray-200 hover:border-indigo-300 rounded-2xl text-gray-700 hover:text-indigo-700 font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-md"
          >
            <span>Sign In Instead</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </form>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Secure & Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Privacy Protected</span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default SignUp;