import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaThumbsUp, FaThumbsDown, FaFileAlt, FaComment, FaShare } from 'react-icons/fa';
import Comments from './Comments';
import SkeletonCard from './SkeletonCard';

const ComparisonView = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [compactData, setCompactData] = useState({});
  const [showComments, setShowComments] = useState({});
  const [voted, setVoted] = useState({});

  useEffect(() => {
    setLoading(true);
    const fetchEvent = async () => {
      try {
        // Simulate a longer loading time to show the skeleton loader
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await fetch(`/api/news/${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleLike = async (articleId, action) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to vote.');
      return;
    }

    try {
      const response = await fetch(`/api/news/${articleId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit your vote.');
      }
      setVoted(prev => ({ ...prev, [articleId]: action }));
      toast.success('Your vote has been recorded!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleCompact = async (articleId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const [summaryRes, biasRes] = await Promise.all([
        fetch(`/api/news/${articleId}/summary`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/news/${articleId}/bias`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
      ]);

      if (summaryRes.status === 403 || biasRes.status === 403) {
        navigate('/subscription');
        return;
      }

      if (!summaryRes.ok || !biasRes.ok) {
        throw new Error('Failed to fetch compact data.');
      }

      const summaryData = await summaryRes.json();
      const biasData = await biasRes.json();

      setCompactData(prevData => ({
        ...prevData,
        [articleId]: {
          summary: summaryData.summary,
          bias: biasData.bias,
        },
      }));
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info('Link copied to clipboard!');
  };

  const toggleComments = (articleId) => {
    setShowComments(prev => ({ ...prev, [articleId]: !prev[articleId] }));
  };
  
  if (error && !event) {
    return <div className="container mt-4"><p className="text-danger">Could not load event.</p></div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{loading ? <span className="placeholder col-6"></span> : event.event}</h2>
        <button className="btn btn-secondary" onClick={handleShare}><FaShare className="me-2" />Share</button>
      </div>
      <div className="row">
        {loading ? (
          <>
            <div className="col-md-6 mb-4"><SkeletonCard /></div>
            <div className="col-md-6 mb-4"><SkeletonCard /></div>
          </>
        ) : (
          event.articles.map(article => (
            <div key={article.id} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{article.headline}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{article.source} - {article.date}</h6>
                  <p className="card-text">{article.content}</p>

                  <div className={`compact-section ${compactData[article.id] ? 'show' : ''}`}>
                    {compactData[article.id] && (
                      <div className="mt-3">
                        <h6>Summary</h6>
                        <p>{compactData[article.id].summary}</p>
                        <h6>Bias Analysis</h6>
                        <p>
                          {compactData[article.id].bias.level}
                          {compactData[article.id].bias.terms.length > 0 &&
                            ` (Terms: ${compactData[article.id].bias.terms.join(', ')})`
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-3">
                    <button className="btn btn-primary me-2" onClick={() => handleCompact(article.id)}>
                      <FaFileAlt className="me-1" /> Compact
                    </button>
                    <button 
                      className={`btn me-2 ${voted[article.id] === 'like' ? 'btn-success' : 'btn-outline-success'}`} 
                      onClick={() => handleLike(article.id, 'like')}
                    >
                      <FaThumbsUp />
                    </button>
                    <button 
                      className={`btn me-2 ${voted[article.id] === 'dislike' ? 'btn-danger' : 'btn-outline-danger'}`} 
                      onClick={() => handleLike(article.id, 'dislike')}
                    >
                      <FaThumbsDown />
                    </button>
                    <button className="btn btn-info" onClick={() => toggleComments(article.id)}>
                      <FaComment className="me-1" /> {showComments[article.id] ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div className={`comments-section ${showComments[article.id] ? 'show' : ''}`}>
                  {showComments[article.id] && <div className="card-footer"><Comments articleId={article.id} /></div>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComparisonView;