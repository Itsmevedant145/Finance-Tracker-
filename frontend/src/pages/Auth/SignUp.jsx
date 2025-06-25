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

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

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
      <div className="max-w-xl w-full mx-auto p-8 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-zinc-800 mb-2">Create an account</h2>
        <p className="text-zinc-600 mb-6">Please enter your details to continue</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <Inputs
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                label="Full Name"
                placeholder="Enter your full name"
                type="text"
              />
            </div>
            <div className="flex-shrink-0 mt-4 sm:mt-0">
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

          {error && <p className="text-blue-600 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-400 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>

          <p className="text-center text-sm text-zinc-600 mt-4">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="block text-center text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignUp;
