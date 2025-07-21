const express = require('express');
const {
  protect,
  serviceProvider,
  verifiedProvider
} = require('../middleware/authMiddleware');

const app = express();
app.use(express.json());

// Public routes
app.get('/api/providers', (req, res) => {
  res.json({
    providers: [
      { id: 1, name: 'John Doe', serviceType: 'Plumbing', experience: '3 years' },
      { id: 2, name: 'Jane Smith', serviceType: 'Electrical', experience: '5 years' }
    ]
  });
});

app.get('/api/search', (req, res) => {
  const { query, serviceType } = req.query;
  res.json({
    providers: [
      { id: 1, name: 'John Doe', serviceType: 'Plumbing', experience: '3 years' },
      { id: 2, name: 'Jane Smith', serviceType: 'Electrical', experience: '5 years' }
    ],
    searchParams: { query, serviceType }
  });
});

app.get('/api/providers/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    provider: {
      id,
      name: 'John Doe',
      serviceType: 'Plumbing',
      experience: '3 years',
      portfolio: [
        { projectId: '123', description: 'Kitchen renovation' }
      ]
    }
  });
});

// Protected routes
app.post('/api/register', protect, serviceProvider, (req, res) => {
  const { name, email, serviceType, experience } = req.body;
  res.status(201).json({
    message: 'Service provider registered successfully',
    provider: { name, email, serviceType, experience }
  });
});

app.put('/api/profile', protect, serviceProvider, (req, res) => {
  const updates = req.body;
  res.status(200).json({
    message: 'Profile updated successfully',
    provider: { ...req.user, ...updates }
  });
});

app.post('/api/portfolio', protect, verifiedProvider, (req, res) => {
  const { projectId, description, images } = req.body;
  res.status(201).json({
    message: 'Project added to portfolio successfully',
    portfolio: { projectId, description, images }
  });
});

app.post('/api/estimate', protect, (req, res) => {
  const { serviceType, requirements } = req.body;
  res.status(200).json({
    estimate: {
      serviceType,
      requirements,
      estimatedCost: 1000,
      timeline: '2 weeks'
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('\nTest these endpoints:');
  console.log('1. GET    http://localhost:5000/api/providers');
  console.log('2. GET    http://localhost:5000/api/search?query=Interior&serviceType=Design');
  console.log('3. GET    http://localhost:5000/api/providers/1');
  console.log('4. POST   http://localhost:5000/api/register');
  console.log('5. PUT    http://localhost:5000/api/profile');
  console.log('6. POST   http://localhost:5000/api/portfolio');
  console.log('7. POST   http://localhost:5000/api/estimate');
}); 