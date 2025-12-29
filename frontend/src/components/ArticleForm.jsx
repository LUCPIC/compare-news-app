import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ArticleForm = () => {
  const { eventId, articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState({
    source: '',
    headline: '',
    content: '',
  });
  const isEditing = !!articleId;

  useEffect(() => {
    if (isEditing) {
      const fetchArticle = async () => {
        const response = await fetch(`/api/news/${eventId}`);
        const data = await response.json();
        const articleToEdit = data.articles.find(a => a.id === parseInt(articleId, 10));
        if (articleToEdit) {
          setArticle(articleToEdit);
        }
      };
      fetchArticle();
    }
  }, [eventId, articleId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = isEditing
      ? `/api/news/${eventId}/articles/${articleId}`
      : `/api/news/${eventId}/articles`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(article),
      });
      if (!response.ok) {
        throw new Error('Failed to save article.');
      }
      navigate(`/admin/event/${eventId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{isEditing ? 'Edit Article' : 'Add New Article'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="source" className="form-label">Source</label>
          <input
            type="text"
            className="form-control"
            id="source"
            name="source"
            value={article.source}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="headline" className="form-label">Headline</label>
          <input
            type="text"
            className="form-control"
            id="headline"
            name="headline"
            value={article.headline}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            className="form-control"
            id="content"
            name="content"
            rows="10"
            value={article.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Save Article</button>
      </form>
    </div>
  );
};

export default ArticleForm;
