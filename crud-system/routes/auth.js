/**
 * Authentication routes
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { userValidationRules, handleValidationErrors } = require('../middleware/validators');

// Login page route
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', error: null, user: null });
});

// Login form submission
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.render('login', { 
        title: 'Login', 
        error: 'Username and password are required',
        user: null
      });
    }

    // Find user by username
    const user = await User.findByUsername(username);
    
    if (!user) {
      return res.render('login', { 
        title: 'Login', 
        error: 'Invalid credentials',
        user: null
      });
    }

    // Verify password
    const isMatch = await User.verifyPassword(password, user.password);
    
    if (!isMatch) {
      return res.render('login', { 
        title: 'Login', 
        error: 'Invalid credentials',
        user: null
      });
    }

    // Set user session
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    // Redirect based on role
    if (user.role === 'admin') {
      return res.redirect('/admin');
    } else {
      return res.redirect('/student');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).render('error', { 
      message: 'Server error', 
      error: { status: 500 },
      title: 'Error'
    });
  }
});

// Register page route
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register', error: null, user: null });
});

// Register form submission
router.post('/register', userValidationRules, handleValidationErrors, async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if username already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.render('register', { 
        title: 'Register', 
        error: 'Username already exists',
        user: null
      });
    }

    // Create new user
    await User.create({ username, password, role });

    // Redirect to login page
    res.redirect('/login');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).render('error', { 
      message: 'Server error', 
      error: { status: 500 },
      title: 'Error'
    });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).render('error', { 
        message: 'Server error', 
        error: { status: 500 },
        title: 'Error'
      });
    }
    res.redirect('/login');
  });
});

module.exports = router;