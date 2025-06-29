import React, { useState } from 'react';

const departments = ['IT', 'CSE', 'ECE', 'EEE', 'MECH', 'AIDS', 'Administration', 'General'];
const designations = ['Professor', 'Assistant Professor', 'Associate Professor', 'HOD', 'Dean', 'Principal', 'Lab Assistant', 'Administrative Staff'];

export default function StaffCommunicationRoom() {
  const [staffInfo, setStaffInfo] = useState({
    name: '',
    designation: '',
    department: '',
    employeeId: ''
  });
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [activeFeature, setActiveFeature] = useState('chat');
  
  // File upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  // Staff-specific features state
  const [announcement, setAnnouncement] = useState('');
  const [meetingDetails, setMeetingDetails] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    agenda: ''
  });
  const [schedules, setSchedules] = useState([]);
  const [polls, setPolls] = useState([]);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', '']
  });

  const handleJoinStaffRoom = () => {
    if (staffInfo.name.trim() && staffInfo.designation && staffInfo.department && staffInfo.employeeId.trim()) {
      setIsJoined(true);
      setMessages(prev => [...prev, {
        text: `${staffInfo.designation} ${staffInfo.name} from ${staffInfo.department} Department joined the staff room`,
        sender: 'System',
        type: 'join',
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '' && selectedFiles.length === 0) return;
    
    // Handle file uploads
    if (selectedFiles.length > 0) {
      selectedFiles.forEach(async (file) => {
        // Read file content as ArrayBuffer
        const arrayBuffer = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });

        const fileData = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedBy: staffInfo.name,
          uploadedAt: new Date().toLocaleString(),
          content: arrayBuffer,
          mimeType: file.type
        };
        
        setUploadedFiles(prev => [...prev, fileData]);
        
        setMessages(prev => [...prev, {
          text: `📎 Shared file: ${file.name}`,
          sender: staffInfo.name,
          designation: staffInfo.designation,
          department: staffInfo.department,
          timestamp: new Date().toLocaleTimeString(),
          type: 'file',
          fileData: fileData
        }]);
      });
      setSelectedFiles([]);
    }
    
    // Handle text message
    if (inputMessage.trim() !== '') {
      setMessages(prev => [...prev, {
        text: inputMessage,
        sender: staffInfo.name,
        designation: staffInfo.designation,
        department: staffInfo.department,
        timestamp: new Date().toLocaleTimeString(),
        type: 'message'
      }]);
      setInputMessage('');
    }
  };

  const handleAnnouncement = () => {
    if (announcement.trim() === '') return;
    
    setMessages(prev => [...prev, {
      text: announcement,
      sender: staffInfo.name,
      designation: staffInfo.designation,
      department: staffInfo.department,
      timestamp: new Date().toLocaleTimeString(),
      type: 'announcement'
    }]);
    setAnnouncement('');
  };

  const handleScheduleMeeting = () => {
    if (meetingDetails.title && meetingDetails.date && meetingDetails.time) {
      const meetingMsg = `📅 MEETING SCHEDULED\n${meetingDetails.title}\nDate: ${meetingDetails.date}\nTime: ${meetingDetails.time}\nVenue: ${meetingDetails.venue || 'TBD'}\nAgenda: ${meetingDetails.agenda || 'Will be shared later'}`;
      
      setMessages(prev => [...prev, {
        text: meetingMsg,
        sender: staffInfo.name,
        designation: staffInfo.designation,
        department: staffInfo.department,
        timestamp: new Date().toLocaleTimeString(),
        type: 'meeting'
      }]);
      
      setSchedules(prev => [...prev, meetingDetails]);
      setMeetingDetails({ title: '', date: '', time: '', venue: '', agenda: '' });
    }
  };

  const handleCreatePoll = () => {
    if (newPoll.question && newPoll.options.every(opt => opt.trim())) {
      const pollData = {
        id: Date.now(),
        question: newPoll.question,
        options: newPoll.options.map(opt => ({ text: opt, votes: 0 })),
        creator: staffInfo.name,
        voters: []
      };
      
      setPolls(prev => [...prev, pollData]);
      setMessages(prev => [...prev, {
        text: `📊 NEW POLL: ${newPoll.question}`,
        sender: staffInfo.name,
        designation: staffInfo.designation,
        department: staffInfo.department,
        timestamp: new Date().toLocaleTimeString(),
        type: 'poll',
        pollId: pollData.id
      }]);
      
      setNewPoll({ question: '', options: ['', ''] });
    }
  };

  const handleDownloadFile = (fileData) => {
    try {
      // Create Blob from stored ArrayBuffer with proper MIME type
      const blob = new Blob([fileData.content], { type: fileData.mimeType });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = fileData.name;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('File download failed:', error);
      alert(`Download failed: ${error.message}`);
    }
  };

  const handleVotePoll = (pollId, optionIndex) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId && !poll.voters.includes(staffInfo.employeeId)) {
        return {
          ...poll,
          options: poll.options.map((opt, idx) => 
            idx === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
          ),
          voters: [...poll.voters, staffInfo.employeeId]
        };
      }
      return poll;
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('document') || type.includes('word')) return '📝';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
    if (type.includes('presentation') || type.includes('powerpoint')) return '📽️';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎵';
    if (type.includes('zip') || type.includes('rar')) return '🗜️';
    return '📎';
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      'IT': '#9b59b6', 'CSE': '#e67e22', 'ECE': '#f39c12', 'EEE': '#8e44ad',
      'MECH': '#16a085', 'AIDS': '#c0392b', 'Administration': '#34495e', 'General': '#7f8c8d'
    };
    return colors[dept] || '#7f8c8d';
  };

  if (!isJoined) {
    return (
      <div style={styles.container}>
        <div style={styles.joinContainer}>
          <h2 style={styles.title}>🏫 Staff Only Room</h2>
          <p style={styles.subtitle}>Exclusive communication platform for faculty and staff members</p>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name:</label>
            <input
              type="text"
              value={staffInfo.name}
              onChange={(e) => setStaffInfo({...staffInfo, name: e.target.value})}
              style={styles.input}
              placeholder="Enter your full name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Employee ID:</label>
            <input
              type="text"
              value={staffInfo.employeeId}
              onChange={(e) => setStaffInfo({...staffInfo, employeeId: e.target.value})}
              style={styles.input}
              placeholder="Enter your employee ID"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Designation:</label>
            <select
              value={staffInfo.designation}
              onChange={(e) => setStaffInfo({...staffInfo, designation: e.target.value})}
              style={styles.select}
            >
              <option value="">Select Designation</option>
              {designations.map(designation => (
                <option key={designation} value={designation}>{designation}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Department:</label>
            <div style={styles.deptGrid}>
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setStaffInfo({...staffInfo, department: dept})}
                  style={{
                    ...styles.deptButton,
                    backgroundColor: staffInfo.department === dept ? getDepartmentColor(dept) : '#333',
                    borderColor: getDepartmentColor(dept)
                  }}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleJoinStaffRoom} 
            disabled={!staffInfo.name.trim() || !staffInfo.designation || !staffInfo.department || !staffInfo.employeeId.trim()}
            style={{
              ...styles.joinButton,
              opacity: (!staffInfo.name.trim() || !staffInfo.designation || !staffInfo.department || !staffInfo.employeeId.trim()) ? 0.5 : 1
            }}
          >
            Enter Staff Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🏫 Staff Communication Hub</h2>
        <div style={styles.userInfo}>
          <span style={styles.userBadge}>
            {staffInfo.designation} {staffInfo.name}
          </span>
          <span style={{...styles.deptBadge, backgroundColor: getDepartmentColor(staffInfo.department)}}>
            {staffInfo.department}
          </span>
        </div>
      </div>

      <div style={styles.featureBar}>
        {['chat', 'announce', 'meeting', 'poll', 'schedule', 'files'].map(feature => (
          <button
            key={feature}
            onClick={() => setActiveFeature(feature)}
            style={{
              ...styles.featureButton,
              backgroundColor: activeFeature === feature ? '#e74c3c' : '#444'
            }}
          >
            {feature === 'chat' && '💬 Chat'}
            {feature === 'announce' && '📢 Announce'}
            {feature === 'meeting' && '📅 Meeting'}
            {feature === 'poll' && '📊 Poll'}
            {feature === 'schedule' && '🗓️ Schedule'}
            {feature === 'files' && '📁 Files'}
          </button>
        ))}
      </div>

      {activeFeature === 'announce' && (
        <div style={styles.featurePanel}>
          <h3>📢 Make Announcement</h3>
          <textarea
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            style={styles.textarea}
            placeholder="Type your announcement here..."
            rows="4"
          />
          <button onClick={handleAnnouncement} style={styles.actionButton}>
            Send Announcement
          </button>
        </div>
      )}

      {activeFeature === 'meeting' && (
        <div style={styles.featurePanel}>
          <h3>📅 Schedule Meeting</h3>
          <div style={styles.meetingForm}>
            <input
              type="text"
              value={meetingDetails.title}
              onChange={(e) => setMeetingDetails({...meetingDetails, title: e.target.value})}
              placeholder="Meeting Title"
              style={styles.input}
            />
            <div style={styles.dateTimeRow}>
              <input
                type="date"
                value={meetingDetails.date}
                onChange={(e) => setMeetingDetails({...meetingDetails, date: e.target.value})}
                style={styles.dateInput}
              />
              <input
                type="time"
                value={meetingDetails.time}
                onChange={(e) => setMeetingDetails({...meetingDetails, time: e.target.value})}
                style={styles.timeInput}
              />
            </div>
            <input
              type="text"
              value={meetingDetails.venue}
              onChange={(e) => setMeetingDetails({...meetingDetails, venue: e.target.value})}
              placeholder="Venue"
              style={styles.input}
            />
            <textarea
              value={meetingDetails.agenda}
              onChange={(e) => setMeetingDetails({...meetingDetails, agenda: e.target.value})}
              placeholder="Meeting Agenda"
              style={styles.textarea}
              rows="3"
            />
            <button onClick={handleScheduleMeeting} style={styles.actionButton}>
              Schedule Meeting
            </button>
          </div>
        </div>
      )}

      {activeFeature === 'poll' && (
        <div style={styles.featurePanel}>
          <h3>📊 Create Poll</h3>
          <input
            type="text"
            value={newPoll.question}
            onChange={(e) => setNewPoll({...newPoll, question: e.target.value})}
            placeholder="Poll Question"
            style={styles.input}
          />
          {newPoll.options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => {
                const updatedOptions = [...newPoll.options];
                updatedOptions[index] = e.target.value;
                setNewPoll({...newPoll, options: updatedOptions});
              }}
              placeholder={`Option ${index + 1}`}
              style={styles.input}
            />
          ))}
          <button 
            onClick={() => setNewPoll({...newPoll, options: [...newPoll.options, '']})}
            style={styles.addOptionButton}
          >
            + Add Option
          </button>
          <button onClick={handleCreatePoll} style={styles.actionButton}>
            Create Poll
          </button>
        </div>
      )}

      {activeFeature === 'schedule' && (
        <div style={styles.featurePanel}>
          <h3>🗓️ Upcoming Schedules</h3>
          {schedules.length === 0 ? (
            <p style={styles.emptyMessage}>No meetings scheduled yet</p>
          ) : (
            schedules.map((meeting, index) => (
              <div key={index} style={styles.scheduleItem}>
                <h4>{meeting.title}</h4>
                <p>📅 {meeting.date} ⏰ {meeting.time}</p>
                <p>📍 {meeting.venue}</p>
                <p>📋 {meeting.agenda}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeFeature === 'files' && (
        <div style={styles.featurePanel}>
          <h3>📁 Shared Files</h3>
          {uploadedFiles.length === 0 ? (
            <p style={styles.emptyMessage}>No files shared yet</p>
          ) : (
            <div style={styles.fileList}>
              {uploadedFiles.map((file, index) => (
                <div key={index} style={styles.fileItem}>
                  <div style={styles.fileInfo}>
                    <span style={styles.fileIcon}>{getFileIcon(file.type)}</span>
                    <div style={styles.fileDetails}>
                      <div style={styles.fileName}>{file.name}</div>
                      <div style={styles.fileMetadata}>
                        {formatFileSize(file.size)} • Uploaded by {file.uploadedBy} • {file.uploadedAt}
                      </div>
                    </div>
                  </div>
                  <button
                    style={styles.downloadButton}
                    onClick={() => handleDownloadFile(file)}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={styles.chatBox}>
        {messages.length === 0 ? (
          <div style={styles.emptyChat}>
            <p>Welcome to the Staff Communication Hub!</p>
            <p>Connect with fellow faculty and staff members.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{
              ...styles.messageContainer,
              ...(msg.type === 'announcement' ? styles.announcementMessage : {}),
              ...(msg.type === 'meeting' ? styles.meetingMessage : {}),
              ...(msg.type === 'poll' ? styles.pollMessage : {}),
              ...(msg.type === 'join' ? styles.joinMessage : {}),
              ...(msg.type === 'file' ? styles.fileMessage : {})
            }}>
              <div style={styles.messageHeader}>
                <span style={styles.senderName}>
                  {msg.sender !== 'System' ? `${msg.designation} ${msg.sender}` : msg.sender}
                </span>
                {msg.department && msg.department !== 'System' && (
                  <span style={{
                    ...styles.deptTag,
                    backgroundColor: getDepartmentColor(msg.department)
                  }}>
                    {msg.department}
                  </span>
                )}
                <span style={styles.timestamp}>{msg.timestamp}</span>
              </div>
              {msg.type === 'announcement' && (
                <div style={styles.announcementLabel}>📢 STAFF ANNOUNCEMENT</div>
              )}
              {msg.type === 'meeting' && (
                <div style={styles.meetingLabel}>📅 MEETING SCHEDULED</div>
              )}
              {msg.type === 'poll' && (
                <div style={styles.pollLabel}>📊 POLL CREATED</div>
              )}
              {msg.type === 'file' && (
                <div style={styles.fileLabel}>📎 FILE SHARED</div>
              )}
              <div style={styles.messageText}>{msg.text}</div>
              {msg.type === 'poll' && msg.pollId && (
                <div style={styles.pollContainer}>
                  {polls.find(p => p.id === msg.pollId) && (
                    <div>
                      <h4>{polls.find(p => p.id === msg.pollId).question}</h4>
                      {polls.find(p => p.id === msg.pollId).options.map((option, optIdx) => (
                        <div key={optIdx} style={styles.pollOption}>
                          <button
                            onClick={() => handleVotePoll(msg.pollId, optIdx)}
                            disabled={polls.find(p => p.id === msg.pollId).voters.includes(staffInfo.employeeId)}
                            style={styles.voteButton}
                          >
                            {option.text} ({option.votes} votes)
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {msg.type === 'file' && msg.fileData && (
                <div style={styles.filePreview}>
                  <div style={styles.filePreviewInfo}>
                    <span style={styles.fileIcon}>{getFileIcon(msg.fileData.type)}</span>
                    <div>
                      <div style={styles.filePreviewName}>{msg.fileData.name}</div>
                      <div style={styles.filePreviewSize}>{formatFileSize(msg.fileData.size)}</div>
                    </div>
                  </div>
                  <button style={styles.downloadButton}>Download</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {activeFeature === 'chat' && (
        <div>
          {/* File Upload Section */}
          {selectedFiles.length > 0 && (
            <div style={styles.fileUploadPreview}>
              <div style={styles.fileUploadHeader}>
                <span>📎 Files to share ({selectedFiles.length})</span>
                <button 
                  onClick={() => setSelectedFiles([])}
                  style={styles.clearFilesButton}
                >
                  Clear All
                </button>
              </div>
              <div style={styles.selectedFilesList}>
                {selectedFiles.map((file, index) => (
                  <div key={index} style={styles.selectedFileItem}>
                    <span style={styles.fileIcon}>{getFileIcon(file.type)}</span>
                    <div style={styles.selectedFileInfo}>
                      <div style={styles.selectedFileName}>{file.name}</div>
                      <div style={styles.selectedFileSize}>{formatFileSize(file.size)}</div>
                    </div>
                    <button 
                      onClick={() => handleRemoveFile(index)}
                      style={styles.removeFileButton}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div style={styles.inputContainer}>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              style={styles.fileInput}
              id="fileInput"
            />
            <label htmlFor="fileInput" style={styles.fileInputLabel}>
              📎
            </label>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              style={styles.chatInput}
              placeholder="Send a message or share files with fellow staff members..."
            />
            <button onClick={handleSendMessage} style={styles.sendButton}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    backgroundColor: '#0a0a0a',
    color: '#fff',
    borderRadius: 15,
    width: '95%',
    maxWidth: 1000,
    margin: 'auto',
    minHeight: 700,
  },
  joinContainer: {
    textAlign: 'center',
    padding: 40,
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '2.2em',
    background: 'linear-gradient(45deg, #e74c3c, #f39c12, #27ae60)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: '#bbb',
    marginBottom: 30,
    fontSize: '1.1em',
  },
  formGroup: {
    marginBottom: 20,
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: 8,
    color: '#ddd',
    fontSize: '1em',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    border: '2px solid #333',
    backgroundColor: '#222',
    color: '#fff',
    fontSize: '1em',
  },
  select: {
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
    padding: '10px 12px',
    cursor: 'pointer',
    border: '2px solid',
    borderRadius: 8,
    color: 'white',
    fontSize: '0.9em',
    transition: 'all 0.3s ease',
  },
  joinButton: {
    padding: '15px 30px',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#e74c3c',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.1em',
    marginTop: 20,
    fontWeight: 'bold',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '2px solid #333',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  userBadge: {
    padding: '8px 16px',
    borderRadius: 20,
    backgroundColor: '#e74c3c',
    color: 'white',
    fontSize: '0.9em',
    fontWeight: 'bold',
  },
  deptBadge: {
    padding: '6px 12px',
    borderRadius: 15,
    color: 'white',
    fontSize: '0.8em',
    fontWeight: 'bold',
  },
  featureBar: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  featureButton: {
    padding: '10px 15px',
    borderRadius: 8,
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  featurePanel: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    border: '2px solid #333',
  },
  textarea: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    border: '2px solid #333',
    backgroundColor: '#222',
    color: '#fff',
    fontSize: '1em',
    resize: 'vertical',
    marginBottom: 10,
  },
  actionButton: {
    padding: '12px 24px',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#27ae60',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
  },
  meetingForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  dateTimeRow: {
    display: 'flex',
    gap: 10,
  },
  dateInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    border: '2px solid #333',
    backgroundColor: '#222',
    color: '#fff',
  },
  timeInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    border: '2px solid #333',
    backgroundColor: '#222',
    color: '#fff',
  },
  addOptionButton: {
    padding: '8px 16px',
    borderRadius: 6,
    border: '2px dashed #666',
    backgroundColor: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    marginBottom: 10,
  },
  scheduleItem: {
    padding: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginBottom: 10,
    borderLeft: '4px solid #f39c12',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    padding: 20,
  },
  fileList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  fileItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    border: '1px solid #333',
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  fileIcon: {
    fontSize: '1.5em',
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fileMetadata: {
    color: '#888',
    fontSize: '0.9em',
  },
  downloadButton: {
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#3498db',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9em',
  },
  chatBox: {
    minHeight: 300,
    maxHeight: 350,
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
    padding: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    borderLeft: '4px solid #444',
  },
  announcementMessage: {
    backgroundColor: '#2a1a1a',
    borderLeft: '4px solid #e74c3c',
  },
  meetingMessage: {
    backgroundColor: '#1a1a2a',
    borderLeft: '4px solid #f39c12',
  },
  pollMessage: {
    backgroundColor: '#1a2a2a',
    borderLeft: '4px solid #3498db',
  },
  joinMessage: {
    backgroundColor: '#1a2a1a',
    borderLeft: '4px solid #27ae60',
    fontStyle: 'italic',
  },
  fileMessage: {
    backgroundColor: '#2a1a2a',
    borderLeft: '4px solid #9b59b6',
  },
  messageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    fontSize: '0.9em',
    flexWrap: 'wrap',
  },
  senderName: {
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  deptTag: {
    padding: '3px 8px',
    borderRadius: 12,
    fontSize: '0.75em',
    color: 'white',
  },
  timestamp: {
    color: '#888',
    fontSize: '0.8em',
    marginLeft: 'auto',
  },
  announcementLabel: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: '0.9em',
    marginBottom: 5,
  },
  meetingLabel: {
    color: '#f39c12',
    fontWeight: 'bold',
    fontSize: '0.9em',
    marginBottom: 5,
  },
  pollLabel: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: '0.9em',
    marginBottom: 5,
  },
  fileLabel: {
    color: '#9b59b6',
    fontWeight: 'bold',
    fontSize: '0.9em',
    marginBottom: 5,
  },
  messageText: {
    color: '#fff',
    lineHeight: 1.5,
    whiteSpace: 'pre-line',
  },
  pollContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  pollOption: {
    marginBottom: 5,
  },
  voteButton: {
    padding: '8px 12px',
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#3498db',
    color: '#fff',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
  },
  filePreview: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filePreviewInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  filePreviewName: {
    fontWeight: 'bold',
    fontSize: '0.9em',
  },
  filePreviewSize: {
    color: '#888',
    fontSize: '0.8em',
  },
  fileUploadPreview: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    border: '2px dashed #666',
  },
  fileUploadHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    color: '#ddd',
    fontWeight: 'bold',
  },
  clearFilesButton: {
    padding: '4px 8px',
    borderRadius: 4,
    border: 'none',
    backgroundColor: '#e74c3c',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.8em',
  },
  selectedFilesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  selectedFileItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 6,
  },
  selectedFileInfo: {
    flex: 1,
  },
  selectedFileName: {
    fontSize: '0.9em',
    fontWeight: 'bold',
  },
  selectedFileSize: {
    fontSize: '0.8em',
    color: '#888',
  },
  removeFileButton: {
    padding: '2px 6px',
    borderRadius: 3,
    border: 'none',
    backgroundColor: '#e74c3c',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
  },
  inputContainer: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  fileInput: {
    display: 'none',
  },
  fileInputLabel: {
    padding: '12px',
    borderRadius: 8,
    border: '2px solid #333',
    backgroundColor: '#444',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.2em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  chatInput: {
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
    fontWeight: 'bold',
  }
};