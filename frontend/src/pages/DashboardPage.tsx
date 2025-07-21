import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Profile from '../components/auth/Profile'; // For user profile management
// Import other dashboard specific components:
// - ProjectManagementDashboard (for premium users)
// - MyProjectsList
// - CommunicationHubTeaser
// - FinancialToolsLinks
// - MaintenanceScheduler
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Create this CSS file
import { QRCodeSVG } from 'qrcode.react';
import { projectService } from '../services/projectService';

const Dashboard: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) return <p>Loading dashboard data...</p>;
  const { user, logout } = authContext;

  if (!user) {
    return <p>Please <Link to="/login">login</Link> to access your dashboard.</p>;
  }

  // Determine if user is premium for Project Management Dashboard
  const isPremiumUser = (user as any).subscription?.type === 'premium' || false; // Check subscription type for premium status

  // Dummy projects data (replace with real fetch)
  const [projects, setProjects] = useState<Array<{ id?: string; _id?: string; name?: string; title?: string; status: string }>>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState(false);

  // Mock projects for when backend is not available
  const mockProjects = [
    { id: '1', name: 'Kitchen Renovation', status: 'In Progress' },
    { id: '2', name: 'Bathroom Remodel', status: 'Planning' },
    { id: '3', name: 'Garden Landscaping', status: 'Completed' }
  ];

  useEffect(() => {
    projectService.getAllProjects()
      .then(data => {
        setProjects(data);
        setProjectError(false);
      })
      .catch(err => {
        console.error('Failed to fetch projects:', err);
        setProjectError(true);
        setProjects(mockProjects);
      })
      .finally(() => setLoadingProjects(false));
  }, []);

  // Fun tips
  const funTips = [
    'Tip: Regular maintenance increases your property value!',
    'Did you know? Plants can improve indoor air quality.',
    'Pro tip: Set a realistic budget before starting any project.',
    'Fun fact: Natural light boosts productivity and mood!',
    'Tip: Always get multiple quotes before hiring a contractor.'
  ];
  const randomTip = funTips[Math.floor(Math.random() * funTips.length)];

  // Current date/time
  const now = new Date();
  const dateString = now.toLocaleString();

  // MFA demo state
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaVerified, setMfaVerified] = useState(false);
  const mfaSecret = 'JBSWY3DPEHPK3PXP'; // Demo secret
  const otpauthUrl = `otpauth://totp/BuildScape:${user.email}?secret=${mfaSecret}&issuer=BuildScape`;

  const handleAddProject = () => {
    alert('Add Project functionality coming soon!');
  };

  const handleEnableMfa = () => setShowQr(true);
  const handleVerifyMfa = () => {
    setMfaVerified(true);
    setMfaEnabled(true);
  };

  return (
    <div className="dashboard-container">

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1>Welcome, {user.name || user.email}!</h1>
          <div style={{ color: '#666', fontSize: 16 }}>Logged in as: <b>{user.email}</b></div>
        </div>
        <Button variant="secondary" onClick={logout}>Logout</Button>
      </div>
      <div style={{ marginBottom: 16, fontWeight: 500, color: '#007bff' }}>Current date/time: {dateString}</div>
      <div style={{ marginBottom: 16, background: '#f0f8ff', padding: 12, borderRadius: 8, color: '#333' }}>{randomTip}</div>
      <div className="dashboard-grid">
        <section className="dashboard-section profile-section">
          <h2>My Profile</h2>
          <Profile />
        </section>

        <section className="dashboard-section projects-section">
          <h2>My Projects</h2>
          {loadingProjects ? (
            <div>Loading projects...</div>
          ) : projectError ? (
            <>
              <div style={{ color: '#666', marginBottom: 12 }}>Showing demo projects (backend not available)</div>
              <ul style={{ marginBottom: 12 }}>
                {Array.isArray(projects) && projects.map((p: any) => (
                  <li key={p.id || p._id}>
                    <b>{p.name || p.title}</b> <span style={{ color: '#888' }}>({p.status})</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <ul style={{ marginBottom: 12 }}>
              {Array.isArray(projects) && projects.map((p: any) => (
                <li key={p.id || p._id}>
                  <b>{p.name || p.title}</b> <span style={{ color: '#888' }}>({p.status})</span>
                </li>
              ))}
            </ul>
          )}
          <Button onClick={handleAddProject}>Add Project</Button>
        </section>

        {isPremiumUser && (
          <section className="dashboard-section project-management-section">
            <h2>Project Management Dashboard (Premium)</h2>
            {/* Placeholder for ProjectManagementDashboard component */}
            <p>Comprehensive tracking system for all aspects of your premium projects.</p>
            <ul>
              <li>Priority Scheduling Status</li>
              <li>Dedicated Relationship Manager Contact</li>
              <li>Exclusive Design Consultation Bookings</li>
              <li>Luxury Material Access Catalog (Link)</li>
              <li>VIP Discounts Overview</li>
            </ul>
            {/* Example: <ProjectManagementDashboard userId={user.id} /> */}
          </section>
        )}

        <section className="dashboard-section communication-section">
          <h2>Communication Hub</h2>
          {/* Placeholder for CommunicationHubTeaser or actual components */}
          <p>Access in-app messaging, shared documents, and project updates.</p>
          {/* <InAppMessagingPreview /> */}
          {/* <DocumentSharingLinks /> */}
          <Button onClick={() => alert('Navigate to Communication Hub')}>Open Messages</Button>
        </section>

        <section className="dashboard-section tools-section">
          <h2>Tools & Resources</h2>
          {/* Financial Tools */}
              <h3>Financial Planning</h3>
              <ul>
            <li><Link to="/tools/loan-prequal">Integrated Loan Pre-qualification</Link></li>
            <li><Link to="/tools/emi-calculator">EMI Calculator</Link></li>
            <li><Link to="/tools/payment-scheduler">Payment Scheduling Tools</Link></li>
            <li><Link to="/tools/budget-tracker">Budget Tracking</Link></li>
              </ul>

          {/* Maintenance Services */}
              <h3>Post-Project Support</h3>
              <ul>
            <li><Link to="/support/schedule-followup">Schedule Follow-up Services</Link></li>
            <li><Link to="/support/warranty-tracking">Warranty Tracking</Link></li>
            <li>View Maintenance Reminders</li>
              </ul>
        </section>

        {isPremiumUser && (
          <section className="dashboard-section premium-perks-section">
            <h2>Exclusive Premium Perks</h2>
            <ul>
                <li><Link to="/reports/design-trends">Annual Design Trend Report</Link></li>
                <li><Link to="/events">Invitations to Industry Events</Link></li>
            </ul>
          </section>
        )}

        <div style={{ marginBottom: 24 }}>
          <h2>Security Settings</h2>
          <div style={{ background: '#e6f9f0', padding: 16, borderRadius: 8, marginBottom: 12 }}>
            <b>Account Security</b><br />
            Your account is protected with a strong password.<br />
            {!mfaEnabled && !showQr && (
              <Button style={{ marginTop: 12 }} onClick={handleEnableMfa}>Enable MFA (Demo)</Button>
            )}
            {showQr && !mfaVerified && (
              <div style={{ marginTop: 16 }}>
                <div>Scan this QR code with Microsoft Authenticator or Google Authenticator:</div>
                <div style={{ margin: '16px 0' }}>
                  <QRCodeSVG value={otpauthUrl} size={180} />
                </div>
                <div>Then enter the 6-digit code from your app:</div>
                <input
                  type="text"
                  value={mfaCode}
                  onChange={e => setMfaCode(e.target.value)}
                  maxLength={6}
                  style={{ fontSize: 18, padding: 6, margin: '8px 0', width: 120, textAlign: 'center' }}
                  placeholder="123456"
                />
                <Button onClick={handleVerifyMfa} style={{ marginLeft: 8 }}>Verify</Button>
              </div>
            )}
            {mfaVerified && (
              <div style={{ color: 'green', marginTop: 12 }}>
                MFA enabled! 🎉
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;