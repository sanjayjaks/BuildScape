const Project = require('../models/Project');
const ServiceProvider = require('../models/ServiceProvider');

// Project Controller Functions

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { title, description, client, category, budget, location } = req.body;
    
    // Get service provider ID from the authenticated user
    const serviceProvider = await ServiceProvider.findOne({ userId: req.userId });
    if (!serviceProvider) {
      return res.status(403).json({ message: 'Only service providers can create projects' });
    }

    const project = new Project({
      title,
      description,
      serviceProvider: serviceProvider._id,
      client,
      category,
      budget,
      location
    });

    await project.save();
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

// Get all projects for the authenticated service provider
exports.getProjects = async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.findOne({ userId: req.userId });
    if (!serviceProvider) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const projects = await Project.find({ serviceProvider: serviceProvider._id })
      .populate('client', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

// Get a specific project
exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceProvider = await ServiceProvider.findOne({ userId: req.userId });
    
    if (!serviceProvider) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const project = await Project.findOne({
      _id: id,
      serviceProvider: serviceProvider._id
    }).populate('client', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceProvider = await ServiceProvider.findOne({ userId: req.userId });
    
    if (!serviceProvider) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const project = await Project.findOne({
      _id: id,
      serviceProvider: serviceProvider._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update project fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'serviceProvider' && key !== 'client') { // Prevent changing these fields
        project[key] = req.body[key];
      }
    });

    await project.save();
    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceProvider = await ServiceProvider.findOne({ userId: req.userId });
    
    if (!serviceProvider) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const project = await Project.findOneAndDelete({
      _id: id,
      serviceProvider: serviceProvider._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};
