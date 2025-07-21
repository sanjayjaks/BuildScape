import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/projects/ProjectCard';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import './ProjectsPage.css';

// Define ProjectData type directly since it's not exported from ProjectForm
interface ProjectData {
  title: string;
  description: string;
  category: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
}

// Mock data fetching function
const fetchProjects = async (filters?: any): Promise<(ProjectData & {id: string, imageUrl?: string})[]> => {
  console.log("Fetching projects with filters:", filters);
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: 'p1', title: 'Luxury Villa Construction', description: 'A stunning modern villa with landscape.', category: 'Core Construction', imageUrl: 'https://via.placeholder.com/300x200/villa/FFFFFF?Text=Luxury+Villa', status: 'In Progress' },
    { id: 'p2', title: 'Downtown Apartment Redesign', description: 'Complete interior makeover for a chic city apartment.', category: 'Interior Works', imageUrl: 'https://via.placeholder.com/300x200/apartment/FFFFFF?Text=Apartment+Redesign', status: 'Completed' },
    { id: 'p3', title: 'Eco-Friendly Office Fit-out', description: 'Sustainable materials and design for a new office space.', category: 'Interior Works', imageUrl: 'https://via.placeholder.com/300x200/ecooffice/FFFFFF?Text=Eco+Office', status: 'Planning' },
  ];
};

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<(ProjectData & {id: string, imageUrl?: string})[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    image: null as File | null,
    imageUrl: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchProjects()
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch projects:", err);
        setLoading(false);
      });
  }, []);

  const handleOpenModal = () => {
    setForm({ title: '', description: '', category: '', image: null, imageUrl: '' });
    setFormError('');
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setForm(prev => ({ ...prev, imageUrl: ev.target?.result as string }));
      reader.readAsDataURL(file);
    } else {
      setForm(prev => ({ ...prev, imageUrl: '' }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.category.trim()) {
      setFormError('All fields are required.');
      return;
    }
    const newProject = {
      id: `p${Date.now()}`,
      title: form.title,
      description: form.description,
      category: form.category,
      imageUrl: form.imageUrl,
      status: 'Planning' as const,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      budget: { estimated: 0, actual: 0, currency: 'USD' },
      progress: 0,
      contractor: { id: '1', name: 'Default Contractor', rating: 5, contact: '' },
      location: { address: '', city: '', state: '', country: '' },
      tags: [],
      highlights: [],
      team: [],
      documents: [],
      milestones: [],
      risks: [],
      comments: [],
      permissions: { canEdit: true, canDelete: true, canShare: true, canComment: true },
      analytics: { views: 0, shares: 0, favorites: 0, lastUpdated: new Date().toISOString() }
    };
    setProjects(prev => [newProject, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Project Showcase</h1>
      <p>Explore a portfolio of completed and ongoing projects. Get inspired for your next venture!</p>
      
      <div style={{ marginBottom: '20px', textAlign: 'right' }}>
        <button onClick={handleOpenModal} className="create-project-btn">Create New Project (For Users/Providers)</button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Create New Project</h2>
            <form onSubmit={handleSubmit} className="project-form">
              <label>
                Project Name*
                <input name="title" value={form.title} onChange={handleFormChange} required />
              </label>
              <label>
                Description*
                <textarea name="description" value={form.description} onChange={handleFormChange} required />
              </label>
              <label>
                Category*
                <input name="category" value={form.category} onChange={handleFormChange} required />
              </label>
              <label>
                Image
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </label>
              {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="image-preview" />}
              {formError && <div className="form-error">{formError}</div>}
              <div className="form-actions">
                <button type="button" onClick={handleCloseModal}>Cancel</button>
                <button type="submit">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects to display at the moment.</p>
      ) : (
        <div className="project-list-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={{
                ...project,
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                budget: {
                  estimated: 0,
                  actual: 0,
                  currency: 'USD'
                },
                progress: 0,
                contractor: {
                  id: '1',
                  name: 'Default Contractor',
                  rating: 5,
                  contact: ''
                },
                location: {
                  address: '',
                  city: '',
                  state: '',
                  country: ''
                },
                tags: [],
                highlights: [],
                team: [],
                documents: [],
                milestones: [],
                risks: [],
                comments: [],
                permissions: {
                  canEdit: true,
                  canDelete: true,
                  canShare: true,
                  canComment: true
                },
                analytics: {
                  views: 0,
                  shares: 0,
                  favorites: 0,
                  lastUpdated: new Date().toISOString()
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage; 