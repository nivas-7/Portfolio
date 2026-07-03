/**
 * Centralized API client for communicating with the backend.
 * All other frontend scripts should go through the functions
 * exposed here rather than calling fetch() directly.
 */
const API = (() => {
  // Adjust this if your backend runs on a different host/port in production.
  // During local dev, the backend runs on PORT from .env (default 5000).
  const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://portfolio-iz5b.onrender.com/api';

  /**
   * Generic request wrapper with consistent error handling.
   * Throws an Error with a user-friendly message on failure.
   */
  const request = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      // Network failure (server down, no internet) vs. API-returned error
      if (error instanceof TypeError) {
        throw new Error('Unable to reach the server. Please check your connection and try again.');
      }
      throw error;
    }
  };

  /**
   * Fetches the portfolio owner's profile data.
   * @returns {Promise<Object>} profile object
   */
  const getProfile = async () => {
    const res = await request('/profile');
    return res.data;
  };

  /**
   * Fetches the list of skills.
   * @returns {Promise<Array>} array of skill objects
   */
  const getSkills = async () => {
    const res = await request('/skills');
    return res.data;
  };

  /**
   * Fetches the list of projects.
   * @returns {Promise<Array>} array of project objects
   */
  const getProjects = async () => {
    const res = await request('/projects');
    return res.data;
  };

  /**
   * Submits the contact form.
   * @param {Object} payload - { name, email, subject, message }
   * @returns {Promise<Object>} success response data
   */
  const submitContact = async (payload) => {
    const res = await request('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res;
  };

  return { getProfile, getSkills, getProjects, submitContact };
})();