import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const Events = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    location: '',
    image: null
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, orderBy('eventDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const eventsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsList);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    
    const imageRef = ref(storage, `event-images/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const eventDate = new Date(`${formData.date}T${formData.time}`);
      
      await addDoc(collection(db, 'events'), {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        eventDate: eventDate,
        imageUrl: imageUrl,
        createdBy: user.uid,
        createdByName: user.displayName || user.email,
        createdAt: serverTimestamp()
      });

      // Reset form
      setFormData({
        title: '',
        date: '',
        time: '',
        description: '',
        location: '',
        image: null
      });
      setShowCreateForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (eventDate) => {
    if (!eventDate) return '';
    const date = eventDate.toDate ? eventDate.toDate() : new Date(eventDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (eventDate) => {
    const date = eventDate.toDate ? eventDate.toDate() : new Date(eventDate);
    return date > new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-25 rounded-2xl shadow-lg p-6 border border-gray-600/30">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">📅 Campus Events</h1>
            <p className="text-gray-300">Discover and create amazing campus events</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-500 hover:to-gray-700 transition-all border border-gray-500/30"
          >
            {showCreateForm ? 'Cancel' : '+ Create Event'}
          </button>
        </div>
      </div>

      {/* Create Event Form */}
      {showCreateForm && (
        <div className="bg-black/40 backdrop-blur-25 rounded-2xl shadow-lg p-6 border border-gray-600/30">
          <h2 className="text-xl font-bold text-white mb-4">Create New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600/30 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-black/30 text-white placeholder-gray-400"
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600/30 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-black/30 text-white placeholder-gray-400"
                  placeholder="Event location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600/30 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-black/30 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600/30 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-black/30 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-600/30 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-black/30 text-white placeholder-gray-400"
                placeholder="Describe your event..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-600/30 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-black/30 text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:from-gray-500 hover:to-gray-700 transition-all disabled:opacity-50 border border-gray-500/30"
            >
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-black/40 backdrop-blur-25 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-600/30 hover:border-gray-500/50 hover:scale-105">
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  isUpcoming(event.eventDate)
                    ? 'bg-gray-700/50 text-gray-200 border-gray-500/30'
                    : 'bg-black/30 text-gray-400 border-gray-600/30'
                }`}>
                  {isUpcoming(event.eventDate) ? 'Upcoming' : 'Past'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
              <p className="text-gray-300 mb-3 line-clamp-2">{event.description}</p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <span className="mr-2">📅</span>
                  {formatEventDate(event.eventDate)}
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  {event.location}
                </div>
                <div className="flex items-center">
                  <span className="mr-2">👤</span>
                  Created by {event.createdByName}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-medium text-white mb-2">No events yet</h3>
          <p className="text-gray-300">Be the first to create an event!</p>
        </div>
      )}
    </div>
  );
};

export default Events;
