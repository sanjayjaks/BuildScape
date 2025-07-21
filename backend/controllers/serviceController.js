// backend/controllers/serviceController.js

const ServiceProvider = require('../models/ServiceProvider');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.registerServiceProvider = async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    // Check for duplicate email in both User and ServiceProvider collections
    const existingUser = await User.findOne({ email });
    const existingProvider = await ServiceProvider.findOne({ email });
    
    if (existingUser || existingProvider) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Save the uploaded license file path
    let licenseFile = null;
    if (req.files && req.files.length > 0) {
      licenseFile = req.files[0].path;
    }

    // Create the user account first
    const user = new User({
      name,
      email,
      password,
      role: 'serviceProvider'
    });

    await user.save();

    // Create the service provider profile
    const provider = new ServiceProvider({
      name,
      email,
      userId: user._id, // Link to the user account
      userType: 'serviceProvider',
      licenseFile,
      verified: false
    });

    await provider.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: 'serviceProvider' },
      process.env.JWT_SECRET || 'your_super_secret_key_here',
      { expiresIn: '24h' }
    );

    // Return success response with token
    res.status(201).json({
      message: 'Service provider registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Service provider registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.getServiceProviders = async (req, res) => {
  try {
    // Placeholder for actual service provider fetching logic
    res.status(200).json({
      providers: [
        { id: 1, name: 'Provider 1', serviceType: 'Interior Design' },
        { id: 2, name: 'Provider 2', serviceType: 'Construction' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service providers' });
  }
};

exports.getServiceProvider = async (req, res) => {
  try {
    const { id } = req.params;
    res.status(200).json({
      provider: {
        id,
        name: 'Sample Provider',
        serviceType: 'Interior Design',
        experience: '5 years'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service provider' });
  }
};

exports.updateServiceProviderProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    res.status(200).json({
      message: 'Service provider profile updated successfully',
      provider: { id, ...updates }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service provider profile' });
  }
};

exports.addToPortfolio = async (req, res) => {
  try {
    const { projectId, description, images } = req.body;
    res.status(201).json({
      message: 'Project added to portfolio successfully',
      portfolio: { projectId, description, images }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to portfolio' });
  }
};

exports.getServiceEstimate = async (req, res) => {
  try {
    const { serviceType, requirements } = req.body;
    res.status(200).json({
      estimate: {
        serviceType,
        requirements,
        estimatedCost: 1000,
        timeline: '2 weeks'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting service estimate' });
  }
};

exports.searchServiceProviders = async (req, res) => {
  try {
    const { query, serviceType } = req.query;
    res.status(200).json({
      providers: [
        { id: 1, name: 'Provider 1', serviceType: 'Interior Design' },
        { id: 2, name: 'Provider 2', serviceType: 'Construction' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching service providers' });
  }
};
