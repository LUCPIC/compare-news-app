import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title placeholder-glow">
          <span className="placeholder col-6"></span>
        </h5>
        <h6 className="card-subtitle mb-2 text-muted placeholder-glow">
          <span className="placeholder col-4"></span>
        </h6>
        <p className="card-text placeholder-glow">
          <span className="placeholder col-7"></span>
          <span className="placeholder col-4"></span>
          <span className="placeholder col-4"></span>
          <span className="placeholder col-6"></span>
          <span className="placeholder col-8"></span>
        </p>
        <div className="mt-auto pt-3">
          <a href="#" tabIndex="-1" className="btn btn-primary disabled placeholder col-6"></a>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
