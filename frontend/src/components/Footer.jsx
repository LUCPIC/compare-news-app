import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start mt-auto py-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
            <h5 className="text-uppercase">COMPARE</h5>
            <p>
              Putting things in perspective. Your tool for critical news analysis.
            </p>
          </div>
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Links</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <Link to="/about" className="text-dark">About</Link>
              </li>
              <li>
                <Link to="/subscription" className="text-dark">Subscription</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Legal</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#!" className="text-dark">Privacy Policy</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2025 COMPARE
      </div>
    </footer>
  );
};

export default Footer;
