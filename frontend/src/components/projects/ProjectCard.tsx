import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import type { IconType } from 'react-icons';
import { FaHeart, FaShareAlt, FaEdit, FaTrash, FaDownload, FaClock, FaMapMarkerAlt, FaUserTie, FaTags, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { format, differenceInDays, isFuture, isPast } from 'date-fns';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import './ProjectCard.css';

// Enhanced ProjectData interface with comprehensive project details
interface ProjectData {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  startDate: string;
  endDate: string;
  budget: {
    estimated: number;
    actual: number;
    currency: string;
  };
  progress: number;
  contractor: {
    id: string;
    name: string;
    rating: number;
    contact: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  tags: string[];
  highlights: string[];
  team: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadDate: string;
  }[];
  milestones: {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
    description?: string;
  }[];
  risks: {
    id: string;
    description: string;
    severity: 'Low' | 'Medium' | 'High';
    mitigation?: string;
  }[];
  comments: {
    id: string;
    userId: string;
    userName: string;
    content: string;
    timestamp: string;
    attachments?: {
      id: string;
      url: string;
      type: string;
    }[];
  }[];
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
    canComment: boolean;
  };
  analytics: {
    views: number;
    shares: number;
    favorites: number;
    lastUpdated: string;
  };
  customFields?: Record<string, any>;
}

interface ProjectCardProps {
  project: ProjectData;
  onFavorite?: (id: string) => Promise<void>;
  onShare?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (id: string) => void;
  isFavorited?: boolean;
  showActions?: boolean;
  variant?: 'compact' | 'detailed' | 'grid';
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onFavorite,
  onShare,
  onDelete,
  onEdit,
  isFavorited = false,
  showActions = true,
  variant = 'detailed',
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localAnalytics, setLocalAnalytics] = useState(project.analytics);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  // Format currency with proper locale and currency symbol
  const formatBudget = useCallback((amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  // Calculate project timeline and status
  const calculateProjectMetrics = useCallback(() => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const today = new Date();

    const totalDays = differenceInDays(end, start);
    const remainingDays = differenceInDays(end, today);
    const progress = ((totalDays - remainingDays) / totalDays) * 100;

    return {
      totalDays,
      remainingDays,
      progress: Math.min(Math.max(progress, 0), 100),
      isOverdue: isPast(end) && project.status !== 'Completed',
      isUpcoming: isFuture(start),
    };
  }, [project.startDate, project.endDate, project.status]);

  // Handle project actions
  const handleFavorite = async () => {
    try {
      setIsLoading(true);
      if (onFavorite) {
        await onFavorite(project.id);
        setLocalAnalytics(prev => ({
          ...prev,
          favorites: isFavorited ? prev.favorites - 1 : prev.favorites + 1
        }));
      }
    } catch (err) {
      setError('Failed to update favorite status');
      toast.error('Failed to update favorite status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsLoading(true);
      if (onShare) {
        await onShare(project.id);
        setLocalAnalytics(prev => ({
          ...prev,
          shares: prev.shares + 1
        }));
      }
      setIsShareModalOpen(true);
    } catch (err) {
      setError('Failed to share project');
      toast.error('Failed to share project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      if (onDelete) {
        await onDelete(project.id);
        toast.success('Project deleted successfully');
        navigate('/projects');
      }
    } catch (err) {
      setError('Failed to delete project');
      toast.error('Failed to delete project');
    } finally {
      setIsLoading(false);
      setIsConfirmDeleteOpen(false);
    }
  };

  // Export project details as PDF
  const exportToPDF = async () => {
    try {
      setIsLoading(true);
      const element = document.getElementById(`project-card-${project.id}`);
      if (!element) return;

      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`project-${project.id}.pdf`);
      
      toast.success('Project details exported successfully');
    } catch (err) {
      setError('Failed to export project details');
      toast.error('Failed to export project details');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate risk level and status indicators
  const getRiskLevel = useCallback(() => {
    const highRisks = project.risks.filter(risk => risk.severity === 'High').length;
    if (highRisks > 2) return 'High';
    if (highRisks > 0) return 'Medium';
    return 'Low';
  }, [project.risks]);

  const getStatusColor = useCallback(() => {
    const statusColors = {
      'Planning': 'blue',
      'In Progress': 'green',
      'On Hold': 'orange',
      'Completed': 'purple',
      'Cancelled': 'red'
    };
    return statusColors[project.status] || 'gray';
  }, [project.status]);

  // Render project metrics and progress
  const renderProgress = () => {
    const metrics = calculateProjectMetrics();
    return (
      <div className="project-metrics">
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className={`progress-fill ${metrics.isOverdue ? 'overdue' : ''}`}
              style={{ 
                width: `${project.progress}%`,
                backgroundColor: getStatusColor()
              }}
            />
          </div>
          <div className="progress-stats">
            <span className="progress-percentage">{Math.round(project.progress)}%</span>
            <span className="days-remaining">
              {metrics.remainingDays > 0 
                ? `${metrics.remainingDays} days remaining`
                : 'Completed'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Render project team members
  const renderTeam = () => {
    return (
      <div className="project-team">
        <h4>Project Team</h4>
        <div className="team-avatars">
          {project.team.map(member => (
            <div key={member.id} className="team-member" title={`${member.name} - ${member.role}`}>
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="member-avatar" />
              ) : (
                <div className="member-initials">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Main render method
  return (
    <div 
      id={`project-card-${project.id}`}
      className={`project-card ${variant} ${className} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="project-card-header">
        {project.imageUrl && (
          <div className="image-container">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className={`project-card-image ${imageLoaded ? 'loaded' : ''}`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && <div className="image-skeleton-loader" />}
            <div className="image-overlay">
              <div className="project-quick-stats">
                <span><FaHeart /> {localAnalytics.favorites}</span>
                <span><FaShareAlt /> {localAnalytics.shares}</span>
                <span><FaClock /> {format(new Date(project.startDate), 'MMM dd, yyyy')}</span>
              </div>
            </div>
          </div>
        )}
        
        {showActions && (
          <div className="action-buttons">
            {project.permissions.canEdit && (
              <button 
                onClick={() => onEdit?.(project.id)}
                className="edit-button"
                disabled={isLoading}
              >
                <FaEdit />
              </button>
            )}
            {onFavorite && (
              <button 
                onClick={handleFavorite}
                className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
                disabled={isLoading}
              >
                <FaHeart />
              </button>
            )}
            {project.permissions.canShare && (
              <button 
                onClick={handleShare}
                className="share-button"
                disabled={isLoading}
              >
                <FaShareAlt />
              </button>
            )}
            {project.permissions.canDelete && (
              <button 
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="delete-button"
                disabled={isLoading}
              >
                <FaTrash />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="project-card-content">
        <div className="project-header">
          <h3>{project.title}</h3>
          <div className="project-meta">
            <span className="project-category">
              <FaTags /> {project.category}
            </span>
            <span className={`project-status status-${project.status.toLowerCase()}`}>
              <FaCheckCircle /> {project.status}
            </span>
          </div>
        </div>

        <div className="project-details">
          <div className="detail-row">
            <FaMapMarkerAlt />
            <span>{`${project.location.city}, ${project.location.state}`}</span>
          </div>
          <div className="detail-row">
            <FaUserTie />
            <span>{project.contractor.name}</span>
          </div>
          {project.budget && (
            <div className="detail-row">
              <span className="budget-label">Budget:</span>
              <span className="budget-amount">
                {formatBudget(project.budget.estimated, project.budget.currency)}
              </span>
            </div>
          )}
        </div>

        <div className="project-description">
          <p>
            {showFullDescription 
              ? project.description 
              : `${project.description.substring(0, 150)}...`}
            <button 
              className="read-more-button"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? 'Show less' : 'Read more'}
            </button>
          </p>
        </div>

        {renderProgress()}
        {variant === 'detailed' && renderTeam()}

        <div className="project-footer">
          <div className="risk-indicator">
            <FaExclamationTriangle className={`risk-${getRiskLevel().toLowerCase()}`} />
            <span>{getRiskLevel()} Risk</span>
          </div>
          <div className="last-updated">
            Last updated: {format(new Date(project.analytics.lastUpdated), 'MMM dd, yyyy')}
          </div>
        </div>

        <div className="card-actions">
          <Link to={`/projects/${project.id}`} className="button primary">
            View Details
          </Link>
          <button onClick={exportToPDF} className="button secondary">
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* Modals */}
      {isShareModalOpen && (
        <div className="modal share-modal">
          {/* Share modal content */}
        </div>
      )}

      {isConfirmDeleteOpen && (
        <div className="modal delete-modal">
          {/* Delete confirmation modal content */}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ProjectCard;