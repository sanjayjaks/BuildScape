const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userType: { type: String, default: 'serviceProvider' },
  licenseFile: { type: String },
  verified: { type: Boolean, default: false },
  // Add other fields as needed
}, { timestamps: true });

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);
