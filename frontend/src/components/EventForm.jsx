import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EventForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('');
  const isEditing = !!eventId;

  useEffect(() => {
    if (isEditing) {
      const fetchEvent = async () => {
        const response = await fetch(`/api/news/${eventId}`);
        const data = await response.json();
        setEventName(data.event);
      };
      fetchEvent();
    }
  }, [eventId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = isEditing ? `/api/news/${eventId}` : '/api/news';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ event: eventName }),
      });
      if (!response.ok) {
        throw new Error('Failed to save event.');
      }
      navigate('/admin');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{isEditing ? 'Edit Event' : 'Add New Event'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="eventName" className="form-label">Event Name</label>
          <input
            type="text"
            className="form-control"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Save Event</button>
      </form>
    </div>
  );
};

export default EventForm;
