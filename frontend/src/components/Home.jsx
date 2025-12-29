import React, { useState, useEffect } from 'react';

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('general');

  const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

  useEffect(() => {
    const fetchNews = async () => {
      // Reset states for new fetch
      setLoading(true);
      setError('');
      setNews([]);

      try {
        const response = await fetch(`/api/external-news?category=${category}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const message = errorData.message || 'Failed to fetch news';
          throw new Error(`Error ${response.status}: ${message}`);
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
  }, [category]); // Re-run effect when category changes

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Top Headlines</h2>

      <div className="mb-4">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setCategory(cat)}
            className={`btn ${category === cat ? 'btn-primary' : 'btn-outline-primary'} me-2 text-capitalize`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p>Loading news...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="row">
        {!loading && !error && news.map((article, index) => (
          <div key={`${article.url}-${index}`} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{article.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{article.source.name}</h6>
                <p className="card-text">{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-auto">
                  Read Full Article
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
