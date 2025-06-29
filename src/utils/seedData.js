// Demo data seeder for CareerMate AI
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, push } from 'firebase/database';
import { auth, db, realtimeDb } from '../firebase';

// Demo users data
const demoUsers = [
  {
    email: 'student@demo.com',
    password: 'password123',
    name: 'Alex Student',
    role: 'student'
  },
  {
    email: 'alumni@demo.com',
    password: 'password123',
    name: 'Sarah Alumni',
    role: 'alumni'
  },
  {
    email: 'john.student@demo.com',
    password: 'password123',
    name: 'John Smith',
    role: 'student'
  },
  {
    email: 'jane.alumni@demo.com',
    password: 'password123',
    name: 'Jane Doe',
    role: 'alumni'
  }
];

// Demo events data
const demoEvents = [
  {
    title: 'Tech Career Fair 2024',
    description: 'Join us for the biggest tech career fair of the year! Meet recruiters from top companies like Google, Microsoft, Apple, and many startups.',
    location: 'Main Campus Auditorium',
    eventDate: new Date('2024-03-15T10:00:00'),
    createdByName: 'Career Services',
    imageUrl: null
  },
  {
    title: 'Alumni Networking Night',
    description: 'Connect with successful alumni from various industries. Great opportunity for mentorship and career guidance.',
    location: 'Student Union Building',
    eventDate: new Date('2024-03-20T18:00:00'),
    createdByName: 'Alumni Association',
    imageUrl: null
  },
  {
    title: 'Resume Workshop',
    description: 'Learn how to craft the perfect resume that gets you noticed by employers. Includes one-on-one feedback sessions.',
    location: 'Library Conference Room',
    eventDate: new Date('2024-03-10T14:00:00'),
    createdByName: 'Career Services',
    imageUrl: null
  },
  {
    title: 'Startup Pitch Competition',
    description: 'Present your innovative ideas to a panel of investors and entrepreneurs. Winner gets $10,000 seed funding!',
    location: 'Innovation Hub',
    eventDate: new Date('2024-04-05T16:00:00'),
    createdByName: 'Entrepreneurship Club',
    imageUrl: null
  },
  {
    title: 'Industry Panel: Future of AI',
    description: 'Leading AI experts discuss the future of artificial intelligence and career opportunities in the field.',
    location: 'Virtual Event (Zoom)',
    eventDate: new Date('2024-03-25T15:00:00'),
    createdByName: 'Computer Science Department',
    imageUrl: null
  }
];

// Demo chat messages
const demoChatMessages = [
  {
    text: 'Welcome to the CareerMate AI chat room! 👋',
    userName: 'Sarah Alumni',
    userId: 'demo-alumni-1',
    timestamp: Date.now() - 86400000, // 1 day ago
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    text: 'Hi everyone! Excited to connect with fellow students and alumni.',
    userName: 'Alex Student',
    userId: 'demo-student-1',
    timestamp: Date.now() - 82800000, // 23 hours ago
    createdAt: new Date(Date.now() - 82800000).toISOString()
  },
  {
    text: 'Does anyone have experience with software engineering interviews at FAANG companies?',
    userName: 'John Smith',
    userId: 'demo-student-2',
    timestamp: Date.now() - 79200000, // 22 hours ago
    createdAt: new Date(Date.now() - 79200000).toISOString()
  },
  {
    text: 'I worked at Google for 3 years! Happy to share some tips. The key is practicing system design and coding problems consistently.',
    userName: 'Jane Doe',
    userId: 'demo-alumni-2',
    timestamp: Date.now() - 75600000, // 21 hours ago
    createdAt: new Date(Date.now() - 75600000).toISOString()
  },
  {
    text: 'That would be amazing! Could you recommend any specific resources?',
    userName: 'John Smith',
    userId: 'demo-student-2',
    timestamp: Date.now() - 72000000, // 20 hours ago
    createdAt: new Date(Date.now() - 72000000).toISOString()
  },
  {
    text: 'Sure! I recommend LeetCode for coding practice, and "Designing Data-Intensive Applications" for system design. Also, mock interviews are crucial!',
    userName: 'Jane Doe',
    userId: 'demo-alumni-2',
    timestamp: Date.now() - 68400000, // 19 hours ago
    createdAt: new Date(Date.now() - 68400000).toISOString()
  }
];

// Function to create demo users
export const createDemoUsers = async () => {
  console.log('Creating demo users...');
  
  for (const userData of demoUsers) {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, {
        displayName: userData.name
      });

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: new Date().toISOString(),
        profileComplete: true
      });

      console.log(`Created user: ${userData.name} (${userData.role})`);
    } catch (error) {
      console.log(`User ${userData.email} might already exist:`, error.message);
    }
  }
};

// Function to seed demo events
export const seedDemoEvents = async () => {
  console.log('Seeding demo events...');
  
  for (const eventData of demoEvents) {
    try {
      await addDoc(collection(db, 'events'), {
        ...eventData,
        createdBy: 'demo-admin',
        createdAt: new Date().toISOString()
      });
      console.log(`Created event: ${eventData.title}`);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  }
};

// Function to seed demo chat messages
export const seedDemoChatMessages = async () => {
  console.log('Seeding demo chat messages...');
  
  for (const messageData of demoChatMessages) {
    try {
      const messagesRef = ref(realtimeDb, 'chatMessages');
      await push(messagesRef, messageData);
      console.log(`Created message from: ${messageData.userName}`);
    } catch (error) {
      console.error('Error creating message:', error);
    }
  }
};

// Main seeding function
export const seedAllDemoData = async () => {
  try {
    console.log('🌱 Starting demo data seeding...');
    
    // Note: User creation requires manual execution due to auth requirements
    console.log('⚠️  Demo users need to be created manually through the signup form');
    
    await seedDemoEvents();
    await seedDemoChatMessages();
    
    console.log('✅ Demo data seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  }
};

// Export individual functions for manual use
const seedDataUtils = {
  createDemoUsers,
  seedDemoEvents,
  seedDemoChatMessages,
  seedAllDemoData
};

export default seedDataUtils;
