const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const { v4: uuidv4 } = require('uuid');
const {
  NotFoundError,
  ValidationError
} = require('../utils/errors');

let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 999.99,
    category: 'Electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest smartphone model',
    price: 699.99,
    category: 'Electronics',
    inStock: true
  }
];

// GET all products (with filtering and pagination)
router.get('/', (req, res) => {
  let filteredProducts = [...products];
  
  // Filter by category
  if (req.query.category) {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }
  
  // Filter by inStock
  if (req.query.inStock) {
    filteredProducts = filteredProducts.filter(
      p => p.inStock === (req.query.inStock === 'true')
    );
  }
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    total: filteredProducts.length,
    page,
    limit,
    products: paginatedProducts
  });
});

// GET product by ID
router.get('/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return next(new NotFoundError('Product not found'));
  }
  res.json(product);
});

// POST create new product (protected)
router.post('/', authenticate, validateProduct, (req, res, next) => {
  try {
    const newProduct = {
      id: uuidv4(),
      ...req.body
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// PUT update product (protected)
router.put('/:id', authenticate, validateProduct, (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return next(new NotFoundError('Product not found'));
    }
    
    const updatedProduct = {
      ...products[index],
      ...req.body,
      id: req.params.id // Ensure ID remains the same
    };
    
    products[index] = updatedProduct;
    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
});

// DELETE product (protected)
router.delete('/:id', authenticate, (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return next(new NotFoundError('Product not found'));
    }
    
    products = products.filter(p => p.id !== req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// Search products by name
router.get('/search', (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: 'Name query parameter is required' });
  }
  
  const matchedProducts = products.filter(p =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );
  
  res.json(matchedProducts);
});

// Product statistics
router.get('/stats', (req, res) => {
  const stats = {
    totalProducts: products.length,
    categories: {},
    inStock: products.filter(p => p.inStock).length,
    outOfStock: products.filter(p => !p.inStock).length
  };
  
  products.forEach(product => {
    if (!stats.categories[product.category]) {
      stats.categories[product.category] = 0;
    }
    stats.categories[product.category]++;
  });
  
  res.json(stats);
});

module.exports = router;