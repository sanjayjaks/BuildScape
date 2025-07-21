// backend/utils/emailService.js
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD // Use app password for Gmail
    }
  });
};

// Generate verification token
const generateVerificationToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Send verification email
const sendVerificationEmail = async (user) => {
  try {
    const transporter = createTransporter();
    const verificationToken = generateVerificationToken(user._id);
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const mailOptions = {
      from: `"Construction & Interior Design" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5aa0;">Welcome to Construction & Interior Design!</h2>
          <p>Hi ${user.name},</p>
          <p>Thank you for registering with us. Please verify your email address to complete your registration.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #2c5aa0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p style="color: #888; font-size: 12px;">This link will expire in 24 hours.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px;">
            If you didn't create an account, please ignore this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', user.email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send project notification email
const sendProjectNotification = async (recipient, project, type) => {
  try {
    const transporter = createTransporter();
    let subject, htmlContent;

    switch (type) {
      case 'new_project':
        subject = 'New Project Inquiry Received';
        htmlContent = `
          <h2>New Project Inquiry</h2>
          <p>You have received a new project inquiry!</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>${project.title}</h3>
            <p><strong>Category:</strong> ${project.category}</p>
            <p><strong>Description:</strong> ${project.description}</p>
            <p><strong>Budget:</strong> ₹${project.budget.estimated?.toLocaleString()}</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/projects/${project._id}" 
             style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Project Details
          </a>
        `;
        break;

      case 'status_update':
        subject = 'Project Status Updated';
        htmlContent = `
          <h2>Project Status Update</h2>
          <p>Your project status has been updated:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>${project.title}</h3>
            <p><strong>New Status:</strong> <span style="color: #28a745; font-weight: bold;">${project.status.replace('_', ' ').toUpperCase()}</span></p>
          </div>
          <a href="${process.env.FRONTEND_URL}/projects/${project._id}" 
             style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Project
          </a>
        `;
        break;

      case 'milestone_completed':
        subject = 'Project Milestone Completed';
        htmlContent = `
          <h2>Milestone Completed! 🎉</h2>
          <p>A milestone in your project has been completed:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>${project.title}</h3>
            <p><strong>Milestone:</strong> ${project.latestMilestone?.title}</p>
          </div>
        `;
        break;

      default:
        return;
    }

    const mailOptions = {
      from: `"Construction & Interior Design" <${process.env.EMAIL_USER}>`,
      to: recipient.email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${htmlContent}
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px;">
            This is an automated notification. Please do not reply to this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`${type} email sent to:`, recipient.email);
  } catch (error) {
    console.error('Error sending project notification:', error);
  }
};

// Send welcome email for premium membership
const sendWelcomePremiumEmail = async (user) => {
  try {
    const transporter = createTransporter();
    
    const benefits = {
      silver: ['Priority booking', 'Basic support', '5% discount'],
      gold: ['Priority booking', 'Dedicated manager', '10% discount', 'Exclusive consultations'],
      platinum: ['All Gold benefits', '15% discount', 'VIP access', 'Annual trend reports']
    };

    const mailOptions = {
      from: `"Construction & Interior Design" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Welcome to ${user.membership.type.toUpperCase()} Membership! 🌟`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d4af37;">Welcome to Premium! 🎉</h2>
          <p>Hi ${user.name},</p>
          <p>Congratulations on upgrading to our <strong>${user.membership.type.toUpperCase()}</strong> membership!</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c5aa0;">Your Premium Benefits:</h3>
            <ul>
              ${benefits[user.membership.type]?.map(benefit => `<li>${benefit}</li>`).join('') || ''}
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" 
               style="background-color: #d4af37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Access Premium Dashboard
            </a>
          </div>

          <p>Your membership is active until: <strong>${new Date(user.membership.endDate).toLocaleDateString()}</strong></p>
          
          <p>Thank you for choosing us for your construction and interior design needs!</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Premium welcome email sent to:', user.email);
  } catch (error) {
    console.error('Error sending premium welcome email:', error);
  }
};

module.exports = {
  sendVerificationEmail,
  sendProjectNotification,
  sendWelcomePremiumEmail
};