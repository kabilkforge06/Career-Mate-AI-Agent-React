# CareerMate AI - Firebase Setup Guide

## 🚀 Quick Setup Instructions

### 1. Install Dependencies
```bash
npm install firebase react-router-dom
```

### 2. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project called "CareerMate AI"
3. Enable the following services:
   - **Authentication** (Email/Password)
   - **Firestore Database**
   - **Realtime Database**
   - **Storage**

### 3. Configure Firebase

1. In Firebase Console, go to Project Settings > General
2. Scroll down to "Your apps" and click "Web app" icon
3. Register your app with name "CareerMate AI"
4. Copy the Firebase configuration object
5. Replace the config in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Firestore Security Rules

Set up these security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Events can be read by authenticated users, written by authenticated users
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.createdBy || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

### 5. Realtime Database Security Rules

Set up these security rules in Realtime Database:

```json
{
  "rules": {
    "chatMessages": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$messageId": {
        ".validate": "newData.hasChildren(['text', 'userName', 'userId', 'timestamp']) && newData.child('userId').val() == auth.uid"
      }
    }
  }
}
```

### 6. Storage Security Rules

Set up these security rules in Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /event-images/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.resource.size < 5 * 1024 * 1024 && 
        request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 🎯 Features Implemented

### ✅ Role-Based Authentication
- **Students**: Access to Job Dashboard, Resume Analyzer, Alumni Search, Chat, Events
- **Alumni**: Access to Chat and Events only
- Firebase Auth with email/password
- User roles stored in Firestore

### ✅ Alumni Chatroom
- Real-time messaging using Firebase Realtime Database
- Message timestamps and user identification
- Clean, modern chat interface
- Auto-scroll to latest messages

### ✅ Event Feed
- Create and view campus events
- Image upload support via Firebase Storage
- Event date/time management
- Responsive card layout
- Past/upcoming event indicators

### ✅ Professional UI
- Tailwind CSS styling
- Responsive design
- Modern gradient backgrounds
- Consistent color scheme (cyan/blue theme)
- Loading states and error handling

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 📱 Demo Accounts

After setting up Firebase, you can create these demo accounts:

- **Student**: student@demo.com / password123
- **Alumni**: alumni@demo.com / password123

## 🛠 Troubleshooting

1. **Firebase not connecting**: Check your config in `src/firebase.js`
2. **Authentication errors**: Verify Email/Password is enabled in Firebase Auth
3. **Database permission errors**: Check your Firestore/Realtime DB security rules
4. **Image upload fails**: Verify Storage rules and file size limits

## 📚 Next Steps

1. Set up Firebase project and configure authentication
2. Test login/signup functionality
3. Create demo events and test chat functionality
4. Customize styling and branding as needed
5. Deploy to Firebase Hosting (optional)
