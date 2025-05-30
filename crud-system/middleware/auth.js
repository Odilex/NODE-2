/**
 * Authentication middleware
 */

// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/login');
};

// Check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).render('error', { 
    message: 'Access denied. Admin privileges required.', 
    error: { status: 403 },
    title: 'Access Denied'
  });
};

// Check if user is a student
const isStudent = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'student') {
    return next();
  }
  return res.status(403).render('error', { 
    message: 'Access denied. Student privileges required.', 
    error: { status: 403 },
    title: 'Access Denied'
  });
};

// Set current user in locals for all views
const setCurrentUser = (req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.currentUser = req.session.user || null; // Keep both for backward compatibility
  next();
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isStudent,
  setCurrentUser
};