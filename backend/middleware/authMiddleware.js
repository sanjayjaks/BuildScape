const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const auth = (req, res, next) => {
    // Extract the Authorization header
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is present and formatted correctly
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauthorized: Missing or malformed Authorization header'
        });
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1];

    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key_here');

        // Attach the decoded user ID and role to the request object
        req.userId = decoded.id;
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // Handle specific JWT errors
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Unauthorized: Token has expired'
            });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Unauthorized: Invalid token'
            });
        }

        // Handle other unexpected errors
        console.error('JWT verification error:', err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Check if user is a service provider
const serviceProvider = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  if (req.user.role !== 'serviceProvider') {
    return res.status(403).json({ message: 'Access denied: Not a service provider' });
  }
  next();
};

// Check if service provider is verified
const verifiedProvider = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  if (req.user.role !== 'serviceProvider') {
    return res.status(403).json({ message: 'Access denied: Not a service provider' });
  }
  if (!req.user.verified) {
    return res.status(403).json({ message: 'Access denied: Provider not verified' });
  }
  next();
};

module.exports = { auth, protect: auth, serviceProvider, verifiedProvider };

// // Authentication and Authorization Middleware

// // Protect route - verify user is authenticated
// exports.protect = (req, res, next) => {
//   // TODO: Replace with real JWT verification
//   // For now, simulate a logged-in user
//   req.user = {
//     id: '12345',
//     role: 'user', // Change to test serviceProvider middleware
//     verified: false // Change to test verifiedProvider middleware
//   };
//   next();
// };

// // Check if user is a service provider
// exports.serviceProvider = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({ message: 'Not authenticated' });
//   }
  
//   if (req.user.role !== 'serviceProvider') {
//     return res.status(403).json({ message: 'Access denied: Not a service provider' });
//   }
  
//   next();
// };

// // Check if service provider is verified
// exports.verifiedProvider = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({ message: 'Not authenticated' });
//   }
  
//   if (req.user.role !== 'serviceProvider') {
//     return res.status(403).json({ message: 'Access denied: Not a service provider' });
//   }
  
//   if (!req.user.verified) {
//     return res.status(403).json({ message: 'Access denied: Provider not verified' });
//   }
  
//   next();
// };

// const User = require('../models/User');
// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const user = new User({ name, email, password });
//     await user.save();
//     res.status(201).json({ message: 'User registered', user });
//   } catch (error) {
//     res.status(500).json({ message: 'Registration failed', error: error.message });
//   }
// };

// const ServiceProvider = require('../models/ServiceProvider');
// exports.registerServiceProvider = async (req, res) => {
//   try {
//     const { name, email, serviceType, experience } = req.body;
//     const provider = new ServiceProvider({ name, email, serviceType, experience });
//     await provider.save();
//     res.status(201).json({ message: 'Service provider registered', provider });
//   } catch (error) {
//     res.status(500).json({ message: 'Registration failed', error: error.message });
//   }
// };

// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }
//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }
//     // Optionally, generate a JWT here and return it
//     res.status(200).json({ message: 'Login successful', user });
//   } catch (error) {
//     res.status(500).json({ message: 'Login failed', error: error.message });
//   }
// };
