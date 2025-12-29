import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  if (!user) {
    return <div className="container mt-4"><p>Loading profile...</p></div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">User Profile</h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><strong>Username:</strong> {user.username}</li>
                <li className="list-group-item"><strong>Role:</strong> {user.role}</li>
                <li className="list-group-item">
                  <strong>Subscription:</strong> {user.subscription ? user.subscription.type : 'Free'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
