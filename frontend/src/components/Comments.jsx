import React, { useState, useEffect } from 'react';

const Comments = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/news/${articleId}/comments`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to comment.');
      return;
    }

    try {
      const response = await fetch(`/api/news/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment.');
      }

      const data = await response.json();
      setComments([...comments, data]);
      setNewComment('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading comments...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="mt-4">
      <h5>Comments</h5>
      {comments.map(comment => (
        <div key={comment.id} className="card mb-2">
          <div className="card-body">
            <p className="card-text">{comment.text}</p>
            <footer className="blockquote-footer">{comment.username} on {new Date(comment.date).toLocaleDateString()}</footer>
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Post Comment</button>
      </form>
    </div>
  );
};

export default Comments;
