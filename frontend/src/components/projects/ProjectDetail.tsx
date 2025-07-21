import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaShare, FaClock, FaMapMarkerAlt, FaHardHat, FaLeaf, FaStar, FaChartLine, FaImages, FaVrCardboard, FaFileDownload, FaComments } from 'react-icons/fa';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './ProjectDetail.css';

interface DetailedProject {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  budget?: number;
  estimatedCost?: number;
  timeline?: string;
  startDate: string;
  endDate: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates?: {
      lat: number;
      lng: number;
    }
  };
  serviceProvider?: {
    name: string;
    id: string;
    rating: number;
    completedProjects: number;
    yearsOfExperience: number;
    specializations: string[];
    avatar?: string;
  };
  images?: {
    url: string;
    caption?: string;
    category?: string;
  }[];
  beforeAfter?: {
    beforeUrl: string;
    afterUrl: string;
    description?: string;
    date?: string;
  }[];
  materials?: {
    name: string;
    spec: string;
    supplier?: string;
    cost?: number;
    sustainability?: string;
  }[];
  ecoMaterialsUsed?: string[];
  energyEfficiencyRating?: string;
  leedCertified?: boolean;
  carbonFootprint?: string;
  team?: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  milestones?: {
    id: string;
    title: string;
    date: string;
    status: 'completed' | 'in-progress' | 'upcoming';
    description?: string;
  }[];
  documents?: {
    id: string;
    name: string;
    type: string;
    url: string;
    size?: number;
  }[];
  analytics?: {
    views: number;
    shares: number;
    favorites: number;
    comments: number;
  };
  arModel?: {
    url: string;
    format: string;
    size: number;
  };
  comments?: {
    id: string;
    user: {
      name: string;
      avatar?: string;
    };
    text: string;
    date: string;
    rating?: number;
  }[];
}

const fetchProjectDetails = async (id: string): Promise<DetailedProject | null> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (id === "1") {
    return {
      id: "1",
      title: "Modern Kitchen Renovation",
      description: "Complete overhaul of a 1980s kitchen to a modern, open-concept culinary space. Features custom cabinetry, quartz countertops, and energy-efficient appliances. The renovation focused on maximizing natural light and creating an ergonomic workflow. Special attention was paid to sustainable materials and energy-efficient solutions.",
      category: "Interior Works - Specific Room Renovation",
      status: "Completed",
      startDate: "2023-06-01",
      endDate: "2023-07-15",
      budget: 50000,
      estimatedCost: 48500,
      timeline: "6 weeks",
      location: {
        address: "123 Renovation Lane",
        city: "Design City",
        state: "CA",
        coordinates: {
          lat: 34.0522,
          lng: -118.2437
        }
      },
      serviceProvider: {
        name: "ProKitchen Designers",
        id: "sp123",
        rating: 4.8,
        completedProjects: 150,
        yearsOfExperience: 12,
        specializations: ["Kitchen Design", "Sustainable Renovations", "Custom Cabinetry"],
        avatar: "https://via.placeholder.com/150"
      },
      images: [
        { url: "https://via.placeholder.com/1200x800", caption: "Main kitchen view", category: "Final" },
        { url: "https://via.placeholder.com/1200x800", caption: "Island detail", category: "Final" },
        { url: "https://via.placeholder.com/1200x800", caption: "Custom cabinetry", category: "Progress" }
      ],
      beforeAfter: [
        {
          beforeUrl: "https://via.placeholder.com/800x600",
          afterUrl: "https://via.placeholder.com/800x600",
          description: "Kitchen transformation",
          date: "2023-07-15"
        }
      ],
      materials: [
        {
          name: "Countertops",
          spec: "Quartz, Calacatta Gold",
          supplier: "Premium Stones Inc.",
          cost: 8500,
          sustainability: "Eco-friendly manufacturing process"
        },
        {
          name: "Cabinets",
          spec: "Custom Shaker Style, Matte White",
          supplier: "Custom Cabinets Co.",
          cost: 15000,
          sustainability: "FSC-certified wood"
        }
      ],
      ecoMaterialsUsed: ["Recycled glass backsplash", "Low-VOC paint", "Energy Star appliances"],
      energyEfficiencyRating: "A+",
      leedCertified: true,
      carbonFootprint: "1.5 tons CO2e",
      team: [
        {
          id: "t1",
          name: "John Smith",
          role: "Lead Designer",
          avatar: "https://via.placeholder.com/150"
        },
        {
          id: "t2",
          name: "Sarah Johnson",
          role: "Project Manager",
          avatar: "https://via.placeholder.com/150"
        }
      ],
      milestones: [
        {
          id: "m1",
          title: "Design Approval",
          date: "2023-06-01",
          status: "completed",
          description: "Final design plans approved by client"
        },
        {
          id: "m2",
          title: "Demolition",
          date: "2023-06-08",
          status: "completed",
          description: "Removal of old kitchen elements"
        }
      ],
      documents: [
        {
          id: "d1",
          name: "Project Contract",
          type: "PDF",
          url: "#",
          size: 2500000
        },
        {
          id: "d2",
          name: "Design Specifications",
          type: "PDF",
          url: "#",
          size: 1800000
        }
      ],
      analytics: {
        views: 1250,
        shares: 45,
        favorites: 89,
        comments: 23
      },
      arModel: {
        url: "#",
        format: "USDZ",
        size: 15000000
      },
      comments: [
        {
          id: "c1",
          user: {
            name: "Alice Brown",
            avatar: "https://via.placeholder.com/50"
          },
          text: "Amazing transformation! Love the sustainable approach.",
          date: "2023-07-20",
          rating: 5
        }
      ]
    };
  }
  return null;
};

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<DetailedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'materials' | 'team' | 'documents' | 'sustainability'>('overview');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState({ text: '', rating: 5 });
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projectId) {
      setLoading(true);
      fetchProjectDetails(projectId)
        .then(data => {
          if (data) {
            setProject(data);
          } else {
            setError("Project not found.");
          }
        })
        .catch(err => {
          console.error("Error fetching project:", err);
          setError("Failed to load project details.");
        })
        .finally(() => setLoading(false));
    }
  }, [projectId]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.title,
          text: project?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const handleDownloadDocument = (doc: { name: string, url: string }) => {
    // Implement document download logic
    console.log('Downloading:', doc.name);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement comment submission logic
    console.log('New comment:', newComment);
    setShowCommentForm(false);
    setNewComment({ text: '', rating: 5 });
  };

  if (loading) {
    return (
      <div className="project-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading project details...</p>
      </div>
    );
  }

 
  
  if (!project) {
    return (
      <div className="project-detail-not-found">
        <h2>Project Not Found</h2>
        <p>The requested project could not be found.</p>
        <button onClick={() => navigate('/projects')}>Return to Projects</button>
      </div>
    );
  }

  return (
    <div className="project-detail-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="project-header"
      >
        <h1>{project.title}</h1>
        
        <div className="project-meta">
          <div className="meta-item">
            <FaMapMarkerAlt />
            <span>{`${project.location.city}, ${project.location.state}`}</span>
          </div>
          <div className="meta-item">
            <FaClock />
            <span>{project.timeline}</span>
          </div>
          <div className="meta-item status">
            <span className={`status-badge ${project.status.toLowerCase()}`}>
              {project.status}
            </span>
          </div>
        </div>

        <div className="project-actions">
          <button onClick={handleShare} className="action-button share">
            <FaShare /> Share
          </button>
          <button className="action-button favorite">
            <FaHeart /> Favorite
          </button>
          {project.arModel && (
            <button className="action-button ar-view">
              <FaVrCardboard /> View in AR
            </button>
          )}
        </div>
      </motion.div>

      <div className="project-content">
        <div className="content-main">
          <section className="project-gallery">
            <Swiper
              modules={[Navigation, Pagination, EffectFade, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              effect="fade"
              autoplay={{ delay: 5000 }}
              className="gallery-swiper"
            >
              {project.images?.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="gallery-image">
                    <img src={image.url} alt={image.caption || `Project image ${index + 1}`} />
                    {image.caption && (
                      <div className="image-caption">
                        <p>{image.caption}</p>
                        {image.category && <span className="image-category">{image.category}</span>}
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>

          <nav className="project-tabs">
            <button
              className={selectedTab === 'overview' ? 'active' : ''}
              onClick={() => setSelectedTab('overview')}
            >
              Overview
            </button>
            <button
              className={selectedTab === 'materials' ? 'active' : ''}
              onClick={() => setSelectedTab('materials')}
            >
              Materials
            </button>
            <button
              className={selectedTab === 'team' ? 'active' : ''}
              onClick={() => setSelectedTab('team')}
            >
              Team
            </button>
            <button
              className={selectedTab === 'documents' ? 'active' : ''}
              onClick={() => setSelectedTab('documents')}
            >
              Documents
            </button>
            <button
              className={selectedTab === 'sustainability' ? 'active' : ''}
              onClick={() => setSelectedTab('sustainability')}
            >
              Sustainability
            </button>
          </nav>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="tab-content"
            >
              {selectedTab === 'overview' && (
                <div className="overview-tab">
                  <div className="project-description">
                    <h2>Project Description</h2>
                    <p>{project.description}</p>
                  </div>

                  <div className="project-timeline">
                    <h2>Timeline</h2>
                    <div className="timeline-grid">
                      {project.milestones?.map((milestone, index) => (
                        <div key={milestone.id} className={`timeline-item ${milestone.status}`}>
                          <div className="timeline-date">
                            {format(new Date(milestone.date), 'MMM dd, yyyy')}
                          </div>
                          <div className="timeline-content">
                            <h3>{milestone.title}</h3>
                            <p>{milestone.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {project.beforeAfter && (
                    <div className="before-after-section">
                      <h2>Before & After</h2>
                      {project.beforeAfter.map((item, index) => (
                        <div key={index} className="before-after-container">
                          <div className="before-after-images">
                            <div className="before-image">
                              <img src={item.beforeUrl} alt="Before" />
                              <span className="image-label">Before</span>
                            </div>
                            <div className="after-image">
                              <img src={item.afterUrl} alt="After" />
                              <span className="image-label">After</span>
                            </div>
                          </div>
                          {item.description && (
                            <p className="transformation-description">{item.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedTab === 'materials' && (
                <div className="materials-tab">
                  <h2>Materials & Specifications</h2>
                  <div className="materials-grid">
                    {project.materials?.map((material, index) => (
                      <div key={index} className="material-card">
                        <h3>{material.name}</h3>
                        <p className="material-spec">{material.spec}</p>
                        {material.supplier && (
                          <p className="material-supplier">Supplier: {material.supplier}</p>
                        )}
                        {material.sustainability && (
                          <p className="material-sustainability">
                            <FaLeaf /> {material.sustainability}
                          </p>
                        )}
                        {material.cost && (
                          <p className="material-cost">
                            Cost: ${material.cost.toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === 'team' && (
                <div className="team-tab">
                  <h2>Project Team</h2>
                  <div className="team-grid">
                    {project.team?.map(member => (
                      <div key={member.id} className="team-member-card">
                        {member.avatar && (
                          <img src={member.avatar} alt={member.name} className="member-avatar" />
                        )}
                        <h3>{member.name}</h3>
                        <p className="member-role">{member.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === 'documents' && (
                <div className="documents-tab">
                  <h2>Project Documents</h2>
                  <div className="documents-list">
                    {project.documents?.map(doc => (
                      <div key={doc.id} className="document-item">
                        <div className="document-info">
                          <span className="document-type">{doc.type}</span>
                          <h3>{doc.name}</h3>
                          <span className="document-size">
                            {doc.size ? `${(doc.size / 1000000).toFixed(1)} MB` : 'Size unknown'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDownloadDocument(doc)}
                          className="download-button"
                        >
                          <FaFileDownload /> Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === 'sustainability' && (
                <div className="sustainability-tab">
                  <h2>Sustainability Features</h2>
                  <div className="sustainability-content">
                    <div className="eco-materials">
                      <h3>Eco-Friendly Materials</h3>
                      <ul>
                        {project.ecoMaterialsUsed?.map((material, index) => (
                          <li key={index}>
                            <FaLeaf /> {material}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="sustainability-metrics">
                      <div className="metric-card">
                        <h3>Energy Efficiency</h3>
                        <div className="rating">
                          <span className="rating-value">{project.energyEfficiencyRating}</span>
                          <p>Energy Rating</p>
                        </div>
                      </div>

                      <div className="metric-card">
                        <h3>LEED Certification</h3>
                        <div className="certification-status">
                          {project.leedCertified ? (
                            <span className="certified">Certified</span>
                          ) : (
                            <span className="not-certified">Not Certified</span>
                          )}
                        </div>
                      </div>

                      <div className="metric-card">
                        <h3>Carbon Footprint</h3>
                        <p>{project.carbonFootprint}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="content-sidebar">
          <div className="project-stats">
            <div className="stat-item">
              <FaChartLine />
              <span>{project.analytics?.views}</span>
              <label>Views</label>
            </div>
            <div className="stat-item">
              <FaHeart />
              <span>{project.analytics?.favorites}</span>
              <label>Favorites</label>
            </div>
            <div className="stat-item">
              <FaShare />
              <span>{project.analytics?.shares}</span>
              <label>Shares</label>
            </div>
          </div>

          {project.serviceProvider && (
            <div className="service-provider-card">
              <h3>Service Provider</h3>
              <div className="provider-info">
                {project.serviceProvider.avatar && (
                  <img
                    src={project.serviceProvider.avatar}
                    alt={project.serviceProvider.name}
                    className="provider-avatar"
                  />
                )}
                <div className="provider-details">
                  <h4>{project.serviceProvider.name}</h4>
                  <div className="provider-rating">
                    <FaStar />
                    <span>{project.serviceProvider.rating}</span>
                  </div>
                  <p>{project.serviceProvider.completedProjects} projects completed</p>
                  <p>{project.serviceProvider.yearsOfExperience} years of experience</p>
                </div>
              </div>
              <div className="provider-specializations">
                {project.serviceProvider.specializations.map((spec, index) => (
                  <span key={index} className="specialization-tag">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="project-comments">
            <h3>
              <FaComments /> Comments ({project.analytics?.comments})
            </h3>
            <div className="comments-list">
              {project.comments?.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    {comment.user.avatar && (
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="comment-avatar"
                      />
                    )}
                    <div className="comment-meta">
                      <h4>{comment.user.name}</h4>
                      <span className="comment-date">
                        {format(new Date(comment.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    {comment.rating && (
                      <div className="comment-rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < comment.rating! ? 'star-filled' : 'star-empty'}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))}
            </div>
            <button
              className="add-comment-button"
              onClick={() => setShowCommentForm(true)}
            >
              Add Comment
            </button>
          </div>
        </aside>
      </div>

      {showCommentForm && (
        <div className="comment-form-modal">
          <div className="modal-content">
            <h3>Add Comment</h3>
            <form onSubmit={handleSubmitComment}>
              <div className="rating-input">
                <label>Rating:</label>
                <div className="star-rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < newComment.rating ? 'star-filled' : 'star-empty'}
                      onClick={() => setNewComment({ ...newComment, rating: i + 1 })}
                    />
                  ))}
                </div>
              </div>
              <textarea
                value={newComment.text}
                onChange={e => setNewComment({ ...newComment, text: e.target.value })}
                placeholder="Write your comment..."
                required
              />
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  Submit
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowCommentForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;