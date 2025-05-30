/**
 * Admin routes
 */
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { productValidationRules, userValidationRules, idParamValidation, handleValidationErrors } = require('../middleware/validators');

// Admin dashboard
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const productCount = (await Product.findAll()).length;
    const userCount = (await User.findAll()).length;
    
    res.render('admin_dashboard', { 
      title: 'Admin Dashboard',
      user: req.session.user,
      stats: {
        products: productCount,
        users: userCount
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).render('error', { 
      message: 'Error loading dashboard', 
      error: { status: 500 },
      title: 'Error'
    });
  }
});

// ===== PRODUCT MANAGEMENT =====

// View all products
router.get('/products', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const products = await Product.findAll();
    res.render('products', { 
      title: 'Manage Products', 
      products, 
      role: 'admin',
      user: req.session.user
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).render('error', { 
      message: 'Error fetching products', 
      error: { status: 500 },
      title: 'Error'
    });
  }
});

// Display add product form
router.get('/products/add', isAuthenticated, isAdmin, (req, res) => {
  res.render('product_form', { 
    title: 'Add Product', 
    product: {}, 
    action: '/admin/products/add',
    user: req.session.user
  });
});

// Add new product
router.post('/products/add', isAuthenticated, isAdmin, productValidationRules, handleValidationErrors, async (req, res) => {
  try {
    const { name, description, price } = req.body;
    await Product.create({ name, description, price });
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).render('error', { 
      message: 'Error adding product', 
      error: { status: 500 },
      title: 'Error'
    });
  }
});

// Display edit product form
router.get('/products/edit/:id', isAuthenticated, isAdmin, idParamValidation, handleValidationErrors, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).render('error', { 
        message: 'Product not found', 
        error: { status: 404 },
        title: 'Not Found'
      });
    }
    res.render('product_form', { 
      title: 'Edit Product', 
      product, 
      action: `/admin/products/update/${product.id}`,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).render('error', { 
      message: 'Error fetching product', 
      error: { status: 500 },
      title: 'Error'
    });
  }
});

// Update product
router.post('/products/update/:id', isAuthenticated, isAdmin, idParamValidation, productValidationRules, handleValidationErrors, async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const updated = await Product.update(req.params.id, { name, description, price });
    if (!updated) {
      return res.status(404).render('error', { 
        message: 'Product not found', 
        error: { status: 404 },
        title: 'Not Found'
      });
    }
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).render('error', { 
      message: 'Error updating product', 
      error: { status: 500 },
      title: 'Error'
    });
  }
});

// Delete product
router.get('/products/delete/:id', isAuthenticated, isAdmin, idParamValidation, handleValidationErrors, async (req, res) => {
  try {
    const deleted = await Product.delete(req.params.id);
    if (!deleted) {
      return res.status(404).render('error', { 
        message: 'Product not found', 
        error: { status: 404 },
        title: 'Not Found'
      });
    }
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).render('error', { 
      message: 'Error deleting product', 
      error: { status: 500 },
      title: 'Error'
    });
  }
});

// ===== USER MANAGEMENT =====

// View all users
router.get('/users', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('users', { 
      title: 'Manage Users', 
      users,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).render('error', { 
      message: 'Error fetching users', 
      error: { status: 500 },
      title: 'Error'
    });
  }
});

// Display add user form
router.get('/users/add', isAuthenticated, isAdmin, (req, res) => {
  res.render('user_form', { 
    title: 'Add User', 
    userData: {}, 
    action: '/admin/users/add',
    user: req.session.user
  });
});

// Add new user
router.post('/users/add', isAuthenticated, isAdmin, userValidationRules, handleValidationErrors, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    // Check if username already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.render('user_form', { 
        title: 'Add User', 
        userData: { username, role },
        error: 'Username already exists',
        user: req.session.user,
        action: '/admin/users/add'
      });
    }
    
    await User.create({ username, password, role });
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).render('error', { 
      message: 'Error adding user', 
      error: { status: 500 },
      title: 'Error'
    });
  }
});

// Display edit user form
router.get('/users/edit/:id', isAuthenticated, isAdmin, idParamValidation, handleValidationErrors, async (req, res) => {
  try {
    const userData = await User.findById(req.params.id);
    if (!userData) {
      return res.status(404).render('error', { 
        message: 'User not found', 
        error: { status: 404 },
        title: 'Not Found'
      });
    }
    res.render('user_form', { 
      title: 'Edit User', 
      userData, 
      action: `/admin/users/update/${userData.id}`,
      user: req.session.user,
      isEdit: true
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).render('error', { 
      message: 'Error fetching user', 
      error: { status: 500 },
      title: 'Error'
    });
  }
});

// Update user
router.post('/users/update/:id', isAuthenticated, isAdmin, idParamValidation, handleValidationErrors, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const userData = {};
    
    if (username) userData.username = username;
    if (password) userData.password = password;
    if (role) userData.role = role;
    
    const updated = await User.update(req.params.id, userData);
    if (!updated) {
      return res.status(404).render('error', { 
        message: 'User not found', 
        error: { status: 404 },
        title: 'Not Found'
      });
    }
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).render('error', { 
      message: 'Error updating user', 
      error: { status: 500 },
      title: 'Error'
    });
  }
});

// Delete user
router.get('/users/delete/:id', isAuthenticated, isAdmin, idParamValidation, handleValidationErrors, async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id == req.session.user.id) {
      return res.status(400).render('error', { 
        message: 'You cannot delete your own account', 
        error: { status: 400 },
        title: 'Error'
      });
    }
    
    const deleted = await User.delete(req.params.id);
    if (!deleted) {
      return res.status(404).render('error', { 
        message: 'User not found', 
        error: { status: 404 },
        title: 'Not Found'
      });
    }
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).render('error', { 
      message: 'Error deleting user', 
      error: { status: 500 },
      title: 'Error'
    });
  }
});

module.exports = router;