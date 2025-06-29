import React, { useState } from 'react';

const departments = ['IT', 'CSE', 'ECE', 'EEE', 'MECH', 'AIDS'];

function CrossDepartmentChat() {
  const [userDept, setUserDept] = useState('');
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleJoinChat = () => {
    if (userDept && userName.trim()) {
      setIsJoined(true);

      const joinMsg = {
        text: `${userName} from ${userDept} joined the chat!`,
        sender: 'System',
        department: 'System',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, joinMsg]);
    }
  };

  const handleSend = async () => {
    if (inputMessage.trim() === '') return;

    const userMsg = {
      text: inputMessage,
      sender: userName,
      department: userDept,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (isJoined) {
        handleSend();
      } else {
        handleJoinChat();
      }
    }
  };

  const handleDiscordInvite = () => {
    window.open('https://discord.gg/fFZfYW6A', '_blank');
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      'IT': '#3498db',
      'CSE': '#e74c3c',
      'ECE': '#f39c12',
      'EEE': '#9b59b6',
      'MECH': '#2ecc71',
      'AIDS': '#e67e22',
      'System': '#95a5a6'
    };
    return colors[dept] || '#7f8c8d';
  };

  if (!isJoined) {
    return (
      <div style={styles.container}>
        <div style={styles.joinContainer}>
          <h2 style={styles.title}>Join Cross-Department Chat</h2>
          <p style={styles.subtitle}>Connect with students from all departments!</p>

          <div style={styles.formGroup}>
            <label style={styles.label}>Your Name:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={handleKeyPress}
              style={styles.nameInput}
              placeholder="Enter your name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Your Department:</label>
            <div style={styles.deptGrid}>
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setUserDept(dept)}
                  style={{
                    ...styles.deptButton,
                    backgroundColor: userDept === dept ? getDepartmentColor(dept) : '#333',
                    borderColor: getDepartmentColor(dept)
                  }}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleJoinChat} 
            disabled={!userDept || !userName.trim()}
            style={{
              ...styles.joinButton,
              opacity: (!userDept || !userName.trim()) ? 0.5 : 1
            }}
          >
            Join Chat Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Cross-Department Chat Room</h2>
        <div style={styles.headerRight}>
          <div style={styles.userInfo}>
            <span style={{...styles.userBadge, backgroundColor: getDepartmentColor(userDept)}}>
              {userName} ({userDept})
            </span>
          </div>
        </div>
      </div>

      {/* Floating Discord Bot Button */}
      <div 
        style={styles.floatingDiscord} 
        onClick={handleDiscordInvite}
        className="floating-discord"
        title="Visit our Discord Bot for Career Guidance"
      >
        <div style={styles.floatingDiscordIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        </div>
        <div style={styles.floatingDiscordText}>
          <div style={styles.discordTitle}>Career Bot</div>
          <div style={styles.discordSubtitle}>Get job search help & resources</div>
        </div>
      </div>

      <div style={styles.chatBox}>
        {messages.length === 0 ? (
          <div style={styles.emptyChat}>
            <p>Welcome to the cross-department chat! Start a conversation with students from other departments.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={styles.messageContainer}>
              <div style={styles.messageHeader}>
                <span style={{
                  ...styles.senderName,
                  color: getDepartmentColor(msg.department)
                }}>
                  {msg.sender}
                </span>
                {msg.department !== 'System' && (
                  <span style={styles.deptTag}>
                    {msg.department}
                  </span>
                )}
                <span style={styles.timestamp}>{msg.timestamp}</span>
              </div>
              <div style={styles.messageText}>{msg.text}</div>
            </div>
          ))
        )}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.input}
          placeholder="Type your message to all departments..."
        />
        <button onClick={handleSend} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    backgroundColor: '#0f0f0f',
    color: '#fff',
    borderRadius: 15,
    width: '90%',
    maxWidth: 800,
    margin: 'auto',
    minHeight: 600,
    position: 'relative',
  },
  joinContainer: {
    textAlign: 'center',
    padding: 40,
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '2em',
    background: 'linear-gradient(45deg, #3498db, #e74c3c, #f39c12)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: '#bbb',
    marginBottom: 30,
  },
  formGroup: {
    marginBottom: 25,
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: 8,
    color: '#ddd',
    fontSize: '1.1em',
  },
  nameInput: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    border: '2px solid #333',
    backgroundColor: '#222',
    color: '#fff',
    fontSize: '1em',
  },
  deptGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 10,
  },
  deptButton: {
    padding: '12px 16px',
    cursor: 'pointer',
    border: '2px solid',
    borderRadius: 8,
    color: 'white',
    fontSize: '1em',
    transition: 'all 0.3s ease',
  },
  joinButton: {
    padding: '15px 30px',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#27ae60',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.1em',
    marginTop: 20,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '2px solid #333',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  floatingDiscord: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    backgroundColor: '#5865F2',
    borderRadius: 15,
    padding: '15px 20px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(88, 101, 242, 0.4)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    zIndex: 999,
    border: '2px solid #4752C4',
    animation: 'pulse 2s infinite',
    maxWidth: 280,
  },
  floatingDiscordIcon: {
    fontSize: '1.5em',
    color: '#fff',
    animation: 'bounce 1s infinite',
    minWidth: 24,
  },
  floatingDiscordText: {
    color: '#fff',
    textAlign: 'left',
  },
  discordTitle: {
    fontSize: '1em',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  discordSubtitle: {
    fontSize: '0.8em',
    opacity: 0.9,
    lineHeight: 1.2,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  userBadge: {
    padding: '8px 16px',
    borderRadius: 20,
    color: 'white',
    fontSize: '0.9em',
    fontWeight: 'bold',
  },
  chatBox: {
    minHeight: 350,
    maxHeight: 400,
    overflowY: 'auto',
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 15,
    border: '1px solid #333',
  },
  emptyChat: {
    textAlign: 'center',
    color: '#888',
    padding: 40,
  },
  messageContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    borderLeft: '4px solid #444',
  },
  messageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
    fontSize: '0.9em',
  },
  senderName: {
    fontWeight: 'bold',
  },
  deptTag: {
    backgroundColor: '#444',
    padding: '2px 8px',
    borderRadius: 12,
    fontSize: '0.8em',
    color: '#bbb',
  },
  timestamp: {
    color: '#888',
    fontSize: '0.8em',
    marginLeft: 'auto',
  },
  messageText: {
    color: '#fff',
    lineHeight: 1.4,
  },
  inputContainer: {
    display: 'flex',
    gap: 10,
  },
  input: {
    flexGrow: 1,
    padding: 12,
    borderRadius: 8,
    border: '2px solid #333',
    backgroundColor: '#222',
    color: '#fff',
    fontSize: '1em',
  },
  sendButton: {
    padding: '12px 24px',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#3498db',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1em',
    transition: 'background-color 0.3s ease',
  }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { box-shadow: 0 4px 12px rgba(88, 101, 242, 0.4); }
    50% { box-shadow: 0 4px 20px rgba(88, 101, 242, 0.7); }
    100% { box-shadow: 0 4px 12px rgba(88, 101, 242, 0.4); }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-5px); }
    60% { transform: translateY(-3px); }
  }
  
  .floating-discord:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(88, 101, 242, 0.6) !important;
  }
`;
document.head.appendChild(style);

export default CrossDepartmentChat;