// backend/utils/uploadService.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const createUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Organize files by type
    if (file.fieldname === 'avatar') {
      uploadPath += 'avatars/';
    } else if (file.fieldname === 'portfolio') {
      uploadPath += 'portfolio/';
    } else if (file.fieldname === 'documents') {
      uploadPath += 'documents/';
    } else if (file.fieldname === 'project') {
      uploadPath += 'projects/';
    } else {
      uploadPath += 'general/';
    }
    
    createUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type based on field name
  if (file.fieldname === 'avatar') {
    // Only images for avatars
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Avatar must be an image file'), false);
    }
  } else if (file.fieldname === 'portfolio') {
    // Images for portfolio
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Portfolio files must be images'), false);
    }
  } else if (file.fieldname === 'documents') {
    // Documents: PDF, DOC, DOCX, images
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid document format'), false);
    }
  } else {
    // General files
    cb(null, true);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: fileFilter
});

// Upload configurations for different endpoints
const uploadConfigs = {
  avatar: upload.single('avatar'),
  portfolio: upload.array('portfolio', 5),
  documents: upload.array('documents', 5),
  project: upload.array('project', 10),
  mixed: upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'documents', maxCount: 5 },
    { name: 'portfolio', maxCount: 5 }
  ])
};

// Helper function to delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('File deleted:', filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Get file URL
const getFileUrl = (filename, type = 'general') => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/${type}/${filename}`;
};

// Validate file size
const validateFileSize = (req, res, next) => {
  if (req.files) {
    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        return res.status(400).json({
          message: `File ${file.originalname} is too large. Maximum size is 10MB.`
        });
      }
    }
  }
  next();
};

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum size is 10MB.'
      });
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Too many files. Maximum is 10 files.'
      });
    } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        message: 'Unexpected file field.'
      });
    }
  } else if (error) {
    return res.status(400).json({
      message: error.message
    });
  }
  next();
};

// Process uploaded files
const processUploadedFiles = (req, res, next) => {
  if (req.files) {
    const processedFiles = [];
    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    
    files.forEach(file => {
      processedFiles.push({
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        url: getFileUrl(file.filename, file.fieldname)
      });
    });
    
    req.processedFiles = processedFiles;
  }
  next();
};

// Image resizing utility (requires sharp package)
const resizeImage = async (inputPath, outputPath, width, height) => {
  try {
    const sharp = require('sharp');
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
    
    // Delete original if resize successful
    deleteFile(inputPath);
    return outputPath;
  } catch (error) {
    console.error('Error resizing image:', error);
    return inputPath; // Return original path if resize fails
  }
};

module.exports = {
  uploadConfigs,
  deleteFile,
  getFileUrl,
  validateFileSize,
  handleUploadError,
  processUploadedFiles,
  resizeImage
};