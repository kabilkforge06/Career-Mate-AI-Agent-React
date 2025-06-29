# CareerMate AI - Career Development Platform

CareerMate AI is a comprehensive career development platform that leverages artificial intelligence to help students and alumni connect, grow, and succeed in their professional journeys.

## 🌟 Key Features

### 1. AI-Powered Career Planning
- **Job Dashboard**: Get personalized career roadmaps and guidance
- **Resume Analyzer**: AI-powered resume feedback and optimization
- **Skill Gap Analysis**: Identify and bridge professional skill gaps

### 2. Alumni Network
- **Smart Alumni Search**: Connect with alumni based on industry, role, or company
- **Real-time Chat**: Engage in meaningful conversations with alumni
- **Mentorship Programs**: Structured mentoring opportunities

### 3. Professional Development
- **Events Platform**: Access career fairs, workshops, and networking events
- **Department Chat Rooms**: Collaborate with peers and faculty
- **Resource Sharing**: Access career resources and industry insights

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+ (for AI services)
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd kforgecomm
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
- Create a Firebase project
- Enable Authentication, Firestore, and Realtime Database
- Update Firebase configuration in `src/firebase.js`

4. Set up Python environment:
```bash
pip install -r requirements.txt
```

5. Start the development server:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm start`: Run the app in development mode
- `npm test`: Launch the test runner
- `npm run build`: Build for production
- `python alumniapi.py`: Start the AI services backend

## 🏗 Architecture

### Frontend (React)
- Modern React with Hooks
- Tailwind CSS for styling
- Real-time updates with Firebase
- Responsive design

### Backend Services
- Firebase Authentication
- Firestore Database
- Realtime Database for chat
- Python FastAPI for AI services
- FAISS for efficient alumni search

### AI Components
- Resume analysis with NLP
- Career path recommendation engine
- Alumni matching algorithms

## 👥 User Roles

### Students
- Access AI career guidance
- Submit resumes for analysis
- Search and connect with alumni
- Participate in events
- Join chat rooms

### Alumni
- Share professional experiences
- Mentor students
- Participate in events
- Network with other alumni

## 🔐 Security

- Role-based access control
- Secure Firebase Authentication
- Data encryption
- Protected API endpoints

## 📱 Demo Accounts

- Student: student@demo.com / password123
- Alumni: alumni@demo.com / password123

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Create React App for the initial setup
- Firebase for backend services
- Tailwind CSS for styling
- FastAPI for AI services
