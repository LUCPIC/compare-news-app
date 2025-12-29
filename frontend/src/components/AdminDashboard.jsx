import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleDelete = async (eventId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/news/${eventId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to delete event.');
        }
        setNews(news.filter(event => event.id !== eventId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <Link to="/admin/event/new" className="btn btn-primary mb-3">Add New Event</Link>
      <ul className="list-group">
        {news.map(event => (
          <li key={event.id} className="list-group-item d-flex justify-content-between align-items-center">
            {event.event}
            <div>
              <Link to={`/admin/event/${event.id}`} className="btn btn-secondary btn-sm me-2">Edit</Link>
              <button onClick={() => handleDelete(event.id)} className="btn btn-danger btn-sm">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
