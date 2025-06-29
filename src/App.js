import React, { useState } from 'react';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import JobDashboard from './components/JobDashboard';
import AlumniSearch from './components/AlumniSearch';
import ChatRoom from './components/ChatRoom';
import Events from './components/Events';
import AdminPanel from './components/AdminPanel';
import Home from './components/Home';
import AuthWrapper from './components/AuthWrapper';
import CrossDepartmentChat from './components/DepartmentChatRoom';
import StaffCommunicationRoom from './components/StaffCommunicationRoom';
import './App.css';

function App() {
  return (
    <AuthWrapper>
      {({ user, userRole, handleLogout }) => (
        <AppContent user={user} userRole={userRole} handleLogout={handleLogout} />
      )}
    </AuthWrapper>
  );
}

function AppContent({ user, userRole, handleLogout }) {
  const [page, setPage] = useState('home');

  // Define navigation items based on user role
  const getNavItems = () => {
    if (userRole === 'student') {
      return [
        { id: 'home', label: '🏠 Home' },
        { id: 'dashboard', label: '💼 Job Dashboard' },
        { id: 'resume', label: '📝 Resume Analyzer' },
        { id: 'alumni', label: '👥 Alumni Search' },
        { id: 'chat', label: '💬 Chatroom' },
        { id: 'crosschat', label: '🌐 Dept Chat' },
        { id: 'events', label: '📅 Events' },
        { id: 'admin', label: '🛠 Admin Panel' }
      ];
    } else if (userRole === 'staff') {
      return [
        { id: 'home', label: '🏠 Home' },
        { id: 'staffchat', label: '👔 Staff Chat' },
        { id: 'chat', label: '💬 Chatroom' },
        { id: 'crosschat', label: '🌐 Dept Chat' },
        { id: 'events', label: '📅 Events' },
        { id: 'admin', label: '🛠 Admin Panel' }
      ];
    } else if (userRole === 'alumni') {
      return [
        { id: 'home', label: '🏠 Home' },
        { id: 'staffchat', label: '👔 Staff Chat' },
        { id: 'chat', label: '💬 Chatroom' },
        { id: 'crosschat', label: '🌐 Dept Chat' },
        { id: 'events', label: '📅 Events' },
        { id: 'admin', label: '🛠 Admin Panel' }
      ];
    } else {
      // fallback
      return [
        { id: 'home', label: '🏠 Home' },
        { id: 'chat', label: '💬 Chatroom' },
        { id: 'events', label: '📅 Events' },
        { id: 'admin', label: '🛠 Admin Panel' }
      ];
    }
  };

  const navItems = getNavItems();

  React.useEffect(() => {
    setPage('home');
  }, [userRole]);

  return (
    <div className="app-container">
      <header className="header">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="app-title">Communex AI</h1>
            <div className="text-3xl animate-bounce">🎯</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300">
              Welcome, <span className="font-semibold bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">{user.displayName || user.email}</span>
              <span className="ml-2 px-3 py-1 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-full text-xs font-medium shadow-lg border border-gray-500/30">
                {userRole}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:from-gray-600 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-600/30 hover:border-gray-500/50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="nav-container">
        <div className="nav-buttons">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-button ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="main-content">
        {page === 'home' && <Home user={user} userRole={userRole} />}
        {page === 'dashboard' && userRole === 'student' && <JobDashboard />}
        {page === 'resume' && userRole === 'student' && <ResumeAnalyzer />}
        {page === 'alumni' && userRole === 'student' && <AlumniSearch />}
        {page === 'chat' && <ChatRoom user={user} />}
        {page === 'crosschat' && (userRole === 'student' || userRole === 'staff' || userRole === 'alumni') && <CrossDepartmentChat />}
        {page === 'staffchat' && (userRole === 'staff' || userRole === 'alumni') && <StaffCommunicationRoom />}
        {page === 'events' && <Events user={user} />}
        {page === 'admin' && <AdminPanel user={user} />}
      </main>
    </div>
  );
}

export default App;