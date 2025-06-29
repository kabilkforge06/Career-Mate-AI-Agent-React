import React, { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import { realtimeDb } from '../firebase';

const ChatRoom = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Listen for messages in real-time
    const messagesRef = ref(realtimeDb, 'chatMessages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        // Sort by timestamp
        messagesList.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const messagesRef = ref(realtimeDb, 'chatMessages');
      await push(messagesRef, {
        text: newMessage.trim(),
        userName: user.displayName || user.email,
        userId: user.uid,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-black/40 backdrop-blur-25 rounded-3xl shadow-2xl h-[700px] flex flex-col border border-gray-600/30">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-gray-800 to-black text-white p-6 rounded-t-3xl border-b border-gray-600/30">
          <h2 className="text-2xl font-bold flex items-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            💬 Alumni Chat Room
          </h2>
          <p className="text-gray-300 text-base mt-1">Connect with students and alumni</p>
        </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-12">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const showDate = index === 0 ||
              formatDate(message.createdAt) !== formatDate(messages[index - 1]?.createdAt);
            const isOwnMessage = message.userId === user.uid;

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="text-center text-sm text-gray-400 my-6">
                    <span className="bg-black/30 px-4 py-2 rounded-full font-medium border border-gray-600/30">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                )}
                <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-sm lg:max-w-lg px-5 py-3 rounded-2xl text-base ${
                    isOwnMessage
                      ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-lg border border-gray-500/30'
                      : 'bg-black/30 text-gray-200 shadow-md border border-gray-600/30'
                  }`}>
                    {!isOwnMessage && (
                      <div className="text-sm font-semibold mb-2 text-gray-300">
                        {message.userName}
                      </div>
                    )}
                    <div className="break-words leading-relaxed">{message.text}</div>
                    <div className={`text-sm mt-2 ${
                      isOwnMessage ? 'text-gray-300' : 'text-gray-400'
                    }`}>
                      {formatTime(message.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-6 border-t border-gray-600/30 bg-black/20">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-5 py-3 border border-gray-600/30 rounded-full focus:ring-2 focus:ring-gray-400 focus:border-transparent text-base bg-black/30 text-white placeholder-gray-400 shadow-sm backdrop-blur-10"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-8 py-3 rounded-full hover:from-gray-500 hover:to-gray-700 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base shadow-lg border border-gray-500/30"
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default ChatRoom;
