import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ComparisonView from './components/ComparisonView';

import Subscription from './components/Subscription';

import AdminDashboard from './components/AdminDashboard';
import EventForm from './components/EventForm';
import EditEvent from './components/EditEvent';
import ArticleForm from './components/ArticleForm';
import AdminRoute from './components/AdminRoute';

import About from './components/About';
import Profile from './components/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/compare/:eventId" element={<ComparisonView />} />
            <Route path="/subscription" element={<Subscription />} />

            {/* Private Routes */}
            <Route path="/profile" element={<Profile />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<AdminDashboard />} />
              <Route path="event/new" element={<EventForm />} />
              <Route path="event/:eventId" element={<EditEvent />} />
              <Route path="event/:eventId/article/new" element={<ArticleForm />} />
              <Route path="event/:eventId/article/:articleId" element={<ArticleForm />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;