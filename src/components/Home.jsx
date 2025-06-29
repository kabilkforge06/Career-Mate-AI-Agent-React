import React from 'react';
import JobDashboard from './JobDashboard';
import ResumeAnalyzer from './ResumeAnalyzer';
import AlumniSearch from './AlumniSearch';
import ChatRoom from './ChatRoom';
import Events from './Events';
import AdminPanel from './AdminPanel';

const Home = ({ user, userRole }) => {
  const [activeSection, setActiveSection] = React.useState('hero');

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Floating Navigation Menu */}
      <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-50 space-y-4">
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl p-4 border border-gray-600/30">
          <div className="space-y-3">
            <button
              onClick={() => handleSectionChange('hero')}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-500 transform hover:scale-110 ${
                activeSection === 'hero'
                  ? 'bg-gradient-to-r from-white to-gray-300 text-black shadow-lg shadow-white/20'
                  : 'bg-gradient-to-r from-gray-600 to-gray-400 hover:from-gray-500 hover:to-gray-300'
              }`}
              title="Home"
            >
              🏠
            </button>
            {userRole === 'student' && (
              <>
                <button
                  onClick={() => handleSectionChange('job-dashboard')}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-500 transform hover:scale-110 ${
                    activeSection === 'job-dashboard'
                      ? 'bg-gradient-to-r from-white to-gray-300 text-black shadow-lg shadow-white/20'
                      : 'bg-gradient-to-r from-gray-600 to-gray-400 hover:from-gray-500 hover:to-gray-300'
                  }`}
                  title="Job Dashboard"
                >
                  💼
                </button>
                <button
                  onClick={() => handleSectionChange('resume-analyzer')}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-500 transform hover:scale-110 ${
                    activeSection === 'resume-analyzer'
                      ? 'bg-gradient-to-r from-white to-gray-300 text-black shadow-lg shadow-white/20'
                      : 'bg-gradient-to-r from-gray-600 to-gray-400 hover:from-gray-500 hover:to-gray-300'
                  }`}
                  title="Resume Analyzer"
                >
                  📝
                </button>
                <button
                  onClick={() => handleSectionChange('alumni-search')}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-500 transform hover:scale-110 ${
                    activeSection === 'alumni-search'
                      ? 'bg-gradient-to-r from-white to-gray-300 text-black shadow-lg shadow-white/20'
                      : 'bg-gradient-to-r from-gray-600 to-gray-400 hover:from-gray-500 hover:to-gray-300'
                  }`}
                  title="Alumni Search"
                >
                  👥
                </button>
              </>
            )}
            <button
              onClick={() => handleSectionChange('chat-room')}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-500 transform hover:scale-110 ${
                activeSection === 'chat-room'
                  ? 'bg-gradient-to-r from-white to-gray-300 text-black shadow-lg shadow-white/20'
                  : 'bg-gradient-to-r from-gray-600 to-gray-400 hover:from-gray-500 hover:to-gray-300'
              }`}
              title="Alumni Chat"
            >
              💬
            </button>
            <button
              onClick={() => handleSectionChange('events')}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-500 transform hover:scale-110 ${
                activeSection === 'events'
                  ? 'bg-gradient-to-r from-white to-gray-300 text-black shadow-lg shadow-white/20'
                  : 'bg-gradient-to-r from-gray-600 to-gray-400 hover:from-gray-500 hover:to-gray-300'
              }`}
              title="Events"
            >
              📅
            </button>
            <button
              onClick={() => handleSectionChange('admin-panel')}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-500 transform hover:scale-110 ${
                activeSection === 'admin-panel'
                  ? 'bg-gradient-to-r from-white to-gray-300 text-black shadow-lg shadow-white/20'
                  : 'bg-gradient-to-r from-gray-600 to-gray-400 hover:from-gray-500 hover:to-gray-300'
              }`}
              title="Admin Panel"
            >
              🛠
            </button>
          </div>
        </div>
      </div>

      {/* Content Container with Smooth Transitions */}
      <div className="relative min-h-screen">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-gray-500 to-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-gray-700 to-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Hero Section */}
        {activeSection === 'hero' && (
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-fade-in">
            <div className="text-center">
              <div className="mb-8 animate-fade-in-down">
                <h1 className="text-6xl md:text-8xl font-bold mb-6">
                 <span className="text-gradient-title">
                        Communex AI
                 </span>
                </h1>
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <div className="w-16 h-1 bg-gradient-to-r from-gray-400 to-white animate-slide-right"></div>
                  <span className="text-2xl font-semibold text-gray-300">CareerMate Agent</span>
                  <div className="w-16 h-1 bg-gradient-to-r from-white to-gray-400 animate-slide-left"></div>
                </div>
              </div>

              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-500">
                Welcome, <span className="text-white font-semibold">{user.displayName || user.email}</span>!
                Experience the future of career development with our intelligent AI-powered platform.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in-up animation-delay-1000">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 hover:border-gray-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/10">
                  <div className="text-4xl mb-4 animate-bounce">🤖</div>
                  <h3 className="text-xl font-bold mb-4 text-white">AI-Powered Intelligence</h3>
                  <p className="text-gray-300">Advanced machine learning algorithms analyze your profile and provide personalized career recommendations.</p>
                </div>

                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 hover:border-gray-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/10">
                  <div className="text-4xl mb-4 animate-bounce animation-delay-300">🎯</div>
                  <h3 className="text-xl font-bold mb-4 text-white">Smart Matching</h3>
                  <p className="text-gray-300">Connect with the right opportunities, alumni, and resources tailored to your career goals and aspirations.</p>
                </div>

                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 hover:border-gray-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/10">
                  <div className="text-4xl mb-4 animate-bounce animation-delay-500">📈</div>
                  <h3 className="text-xl font-bold mb-4 text-white">Growth Analytics</h3>
                  <p className="text-gray-300">Track your progress with detailed analytics and insights to optimize your career development journey.</p>
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Ready to Transform Your Career?
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Use the navigation menu on the right to explore all features of Cursus AI.
                </p>
                <div className="text-6xl animate-bounce">🚀</div>
              </div>
            </div>
          </div>
        )}

        {/* Job Dashboard Section */}
        {activeSection === 'job-dashboard' && userRole === 'student' && (
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                💼 Job Dashboard
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover personalized job opportunities with AI-powered matching
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg rounded-3xl p-8 border border-gray-600/30 shadow-2xl">
              <JobDashboard />
            </div>
          </div>
        )}

        {/* Resume Analyzer Section */}
        {activeSection === 'resume-analyzer' && userRole === 'student' && (
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                📝 Resume Analyzer
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Get intelligent feedback and optimization suggestions for your resume
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg rounded-3xl p-8 border border-gray-600/30 shadow-2xl">
              <ResumeAnalyzer />
            </div>
          </div>
        )}

        {/* Alumni Search Section */}
        {activeSection === 'alumni-search' && userRole === 'student' && (
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                👥 Alumni Search
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Connect with alumni through intelligent matching
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg rounded-3xl p-8 border border-gray-600/30 shadow-2xl">
              <AlumniSearch />
            </div>
          </div>
        )}

        {/* Chat Room Section */}
        {activeSection === 'chat-room' && (
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                💬 Alumni Chat
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Real-time communication platform for networking and mentorship
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg rounded-3xl p-8 border border-gray-600/30 shadow-2xl">
              <ChatRoom user={user} />
            </div>
          </div>
        )}

        {/* Events Section */}
        {activeSection === 'events' && (
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                📅 Events
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover and participate in career development events
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg rounded-3xl p-8 border border-gray-600/30 shadow-2xl">
              <Events user={user} />
            </div>
          </div>
        )}

        {/* Admin Panel Section */}
        {activeSection === 'admin-panel' && (
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                🛠 Admin Panel
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive management tools for platform administration
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg rounded-3xl p-8 border border-gray-600/30 shadow-2xl">
              <AdminPanel user={user} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
