import React, { useState } from 'react';
import { seedDemoEvents, seedDemoChatMessages } from '../utils/seedData';

const AdminPanel = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeedEvents = async () => {
    setLoading(true);
    setMessage('');
    try {
      await seedDemoEvents();
      setMessage('✅ Demo events created successfully!');
    } catch (error) {
      setMessage('❌ Error creating demo events: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedMessages = async () => {
    setLoading(true);
    setMessage('');
    try {
      await seedDemoChatMessages();
      setMessage('✅ Demo chat messages created successfully!');
    } catch (error) {
      setMessage('❌ Error creating demo messages: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedAll = async () => {
    setLoading(true);
    setMessage('');
    try {
      await seedDemoEvents();
      await seedDemoChatMessages();
      setMessage('✅ All demo data created successfully!');
    } catch (error) {
      setMessage('❌ Error creating demo data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🛠 Admin Panel</h1>
        <p className="text-gray-600 mb-6">Manage demo data and application settings</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={handleSeedEvents}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Seed Demo Events'}
          </button>

          <button
            onClick={handleSeedMessages}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Seed Chat Messages'}
          </button>

          <button
            onClick={handleSeedAll}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Seed All Demo Data'}
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${
            message.includes('✅') 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">⚠️ Important Setup Steps</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>1. Configure Firebase project settings in src/firebase.js</p>
            <p>2. Set up Firestore and Realtime Database security rules</p>
            <p>3. Enable Authentication (Email/Password) in Firebase Console</p>
            <p>4. Enable Storage for event image uploads</p>
            <p>5. Create demo user accounts through the signup form</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
