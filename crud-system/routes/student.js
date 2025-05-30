/**
 * Student routes
 */
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { isAuthenticated, isStudent } = require('../middleware/auth');
const { productValidationRules, idParamValidation, handleValidationErrors } = require('../middleware/validators');

// Student dashboard
router.get('/', isAuthenticated, isStudent, (req, res) => {
  res.render('student_dashboard', { 
    title: 'Student Dashboard',
    user: req.session.user
  });
});

// View all products
router.get('/products', isAuthenticated, isStudent, async (req, res) => {
  try {
    const products = await Product.findAll();
    res.render('products', { 
      title: 'Products', 
      products, 
      role: 'student',
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

// Search products
router.get('/products/search', isAuthenticated, isStudent, async (req, res) => {
  try {
    const { query } = req.query;
    const products = await Product.search(query);
    res.render('products', { 
      title: 'Search Results', 
      products, 
      role: 'student',
      user: req.session.user,
      searchQuery: query
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).render('error', { 
      message: 'Error searching products', 
      error: { status: 500 },
      title: 'Error'
    });
  }
});

// Display add product form
router.get('/products/add', isAuthenticated, isStudent, (req, res) => {
  res.render('product_form', { 
    title: 'Add Product', 
    product: {}, 
    action: '/student/products/add',
    user: req.session.user
  });
});

// Add new product
router.post('/products/add', isAuthenticated, isStudent, productValidationRules, handleValidationErrors, async (req, res) => {
  try {
    const { name, description, price } = req.body;
    await Product.create({ name, description, price });
    res.redirect('/student/products');
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
router.get('/products/edit/:id', isAuthenticated, isStudent, idParamValidation, handleValidationErrors, async (req, res) => {
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
      action: `/student/products/update/${product.id}`,
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
router.post('/products/update/:id', isAuthenticated, isStudent, idParamValidation, productValidationRules, handleValidationErrors, async (req, res) => {
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
    res.redirect('/student/products');
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
router.get('/products/delete/:id', isAuthenticated, isStudent, idParamValidation, handleValidationErrors, async (req, res) => {
  try {
    const deleted = await Product.delete(req.params.id);
    if (!deleted) {
      return res.status(404).render('error', { 
        message: 'Product not found', 
        error: { status: 404 },
        title: 'Not Found'
      });
    }
    res.redirect('/student/products');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).render('error', { 
      message: 'Error deleting product', 
      error: { status: 500 },
      title: 'Error'
    });
  }
});

module.exports = router;