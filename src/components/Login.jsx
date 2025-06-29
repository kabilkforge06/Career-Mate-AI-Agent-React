import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Login = ({ onLogin, switchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      const userRole = userData?.role || 'student';
      onLogin(user, userRole);
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="relative">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent mb-4 animate-pulse">
              Communex
            </h1>
            <div className="absolute -top-2 -right-2 text-3xl animate-bounce">🎯</div>
          </div>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-0.5 bg-gradient-to-r from-gray-400 to-white animate-slide-right"></div>
            <span className="text-xl font-semibold text-white animate-fade-in">AI</span>
            <div className="w-8 h-0.5 bg-gradient-to-r from-white to-gray-400 animate-slide-left"></div>
          </div>
          <p className="text-gray-300 animate-fade-in-up animation-delay-500">Welcome back! Please sign in to continue.</p>
        </div>

        <div className="bg-gray-900/40 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-600/30 animate-fade-in-up animation-delay-300">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-gray-400 to-white mx-auto rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm focus:bg-gray-800/70"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm focus:bg-gray-800/70"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white py-3 px-4 rounded-xl font-medium hover:from-gray-500 hover:to-gray-700 focus:ring-2 focus:ring-gray-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <button
                onClick={switchToSignup}
                className="text-gray-300 hover:text-white font-medium transition-colors duration-300 hover:underline"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
