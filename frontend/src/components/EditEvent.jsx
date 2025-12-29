import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const EditEvent = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await fetch(`/api/news/${eventId}`);
      const data = await response.json();
      setEvent(data);
    };
    fetchEvent();
  }, [eventId]);

  const handleDeleteArticle = async (articleId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (window.confirm('Are you sure you want to delete this article?')) {
        try {
            const response = await fetch(`/api/news/${eventId}/articles/${articleId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to delete article.');
            }
            setEvent(prevEvent => ({
                ...prevEvent,
                articles: prevEvent.articles.filter(a => a.id !== articleId),
            }));
        } catch (err) {
            console.error(err);
        }
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Editing Event: {event.event}</h2>
      <Link to={`/admin/event/${eventId}/article/new`} className="btn btn-primary mb-3">Add New Article</Link>
      <ul className="list-group">
        {event.articles.map(article => (
          <li key={article.id} className="list-group-item d-flex justify-content-between align-items-center">
            {article.headline}
            <div>
              <Link to={`/admin/event/${eventId}/article/${article.id}`} className="btn btn-secondary btn-sm me-2">Edit</Link>
              <button onClick={() => handleDeleteArticle(article.id)} className="btn btn-danger btn-sm">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditEvent;
