const express = require('express');
const router = express.Router();
const { protect, serviceProvider, verifiedProvider } = require('../middleware/authMiddleware');
const { uploadConfigs } = require('../utils/uploadService');
const {
  registerServiceProvider,
  getServiceProviders,
  getServiceProvider,
  updateServiceProviderProfile,
  addToPortfolio,
  getServiceEstimate,
  searchServiceProviders
} = require('../controllers/serviceController');

// Public routes
router.get('/providers', getServiceProviders);
router.get('/search', searchServiceProviders);
router.get('/providers/:id', getServiceProvider);
router.post('/register', (req, res, next) => {
  console.log('Route /api/services/register hit');
  next();
}, uploadConfigs.documents, (req, res, next) => {
  console.log('Multer finished, req.files:', req.files, 'req.body:', req.body);
  next();
}, registerServiceProvider);

// Protected routes
router.use(protect);
router.put('/profile', serviceProvider, updateServiceProviderProfile);
router.post('/portfolio', verifiedProvider, addToPortfolio);
router.post('/estimate', getServiceEstimate);

module.exports = router;