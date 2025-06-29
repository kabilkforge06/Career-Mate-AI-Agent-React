import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Login from './Login';
import Signup from './Signup';

const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          const role = userData?.role || 'student';
          setUser(user);
          setUserRole(role);
          console.log("Logged in user:", user.email, "Role:", role); // Debug
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(user);
          setUserRole('student'); // Default role
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (user, role) => {
    setUser(user);
    setUserRole(role);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading Communex AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <Login 
        onLogin={handleLogin} 
        switchToSignup={() => setAuthMode('signup')} 
      />
    ) : (
      <Signup 
        onLogin={handleLogin} 
        switchToLogin={() => setAuthMode('login')} 
      />
    );
  }

  return children({ user, userRole, handleLogout });
};

export default AuthWrapper;