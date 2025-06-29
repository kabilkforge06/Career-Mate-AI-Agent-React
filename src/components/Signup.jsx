import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const departments = ['IT', 'CSE', 'ECE', 'EEE', 'MECH', 'AIDS', 'Administration', 'General'];
const designations = ['Professor', 'Assistant Professor', 'Associate Professor', 'HOD', 'Dean', 'Principal', 'Lab Assistant', 'Administrative Staff'];

const Signup = ({ onLogin, switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: '',
    designation: '',
    employeeId: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Staff: require department, designation, employeeId
    if (
      formData.role === 'staff' &&
      (!formData.department || !formData.designation || !formData.employeeId)
    ) {
      setError('Please fill all staff details');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: formData.name
      });

      // Prepare user data
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString(),
        profileComplete: true
      };

      if (formData.role === 'staff') {
        userData.department = formData.department;
        userData.designation = formData.designation;
        userData.employeeId = formData.employeeId;
      }

      await setDoc(doc(db, 'users', user.uid), userData);

      onLogin(user, formData.role);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Animated Logo Section */}
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
          <p className="text-gray-300 animate-fade-in-up animation-delay-500">Create your account to get started.</p>
        </div>

        {/* Signup Form */}
        <div className="bg-gray-900/40 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-600/30 animate-fade-in-up animation-delay-300">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Join Us</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-gray-400 to-white mx-auto rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="block text-sm font-medium text-gray-200 mb-2 transition-colors group-focus-within:text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm focus:bg-gray-800/70"
                  placeholder="Enter your full name"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-600/20 to-gray-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-200 mb-2 transition-colors group-focus-within:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm focus:bg-gray-800/70"
                  placeholder="Enter your email"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-600/20 to-gray-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-200 mb-2 transition-colors group-focus-within:text-gray-300">
                Role
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer focus:bg-gray-800/70"
                >
                  <option value="student" className="bg-gray-800 text-white">🎓 Student</option>
                  <option value="alumni" className="bg-gray-800 text-white">👨‍🎓 Alumni</option>
                  <option value="staff" className="bg-gray-800 text-white">👔 Staff</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-600/20 to-gray-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Staff extra fields */}
            {formData.role === 'staff' && (
              <>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-200 mb-2">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer focus:bg-gray-800/70"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-200 mb-2">Designation</label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer focus:bg-gray-800/70"
                  >
                    <option value="">Select Designation</option>
                    {designations.map((des) => (
                      <option key={des} value={des}>{des}</option>
                    ))}
                  </select>
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-200 mb-2">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm focus:bg-gray-800/70"
                    placeholder="Enter your Employee ID"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-200 mb-2 transition-colors group-focus-within:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm focus:bg-gray-800/70"
                    placeholder="Create password"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-600/20 to-gray-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-200 mb-2 transition-colors group-focus-within:text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm focus:bg-gray-800/70"
                    placeholder="Confirm password"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-600/20 to-gray-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white py-3 px-4 rounded-xl font-medium hover:from-gray-500 hover:to-gray-700 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <button
                onClick={switchToLogin}
                className="text-gray-300 hover:text-white font-medium transition-colors duration-300 hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;