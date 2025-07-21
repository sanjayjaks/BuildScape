import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, User, MapPin, Eye, Edit, Trash2, Plus, Filter, Search } from 'lucide-react';

// Define the type for a project
interface Project {
  id: number;
  title: string;
  status: string;
  type: string;
  startDate: string;
  budget: number;
  progress: number;
  contractor: string;
  location: string;
  description: string;
  image: string;
}

interface MyProjectsListProps {
  userId?: string;
}

const MyProjectsList: React.FC<MyProjectsListProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Mock data
  const [projects] = useState<Project[]>([
    {
      id: 1,
      title: 'Kitchen Renovation',
      status: 'In Progress',
      type: 'Renovation',
      startDate: '2024-03-15',
      budget: 25000,
      progress: 65,
      contractor: 'Smith Construction',
      location: 'New York, NY',
      description: 'Complete kitchen makeover with modern appliances',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'
    },
    {
      id: 2,
      title: 'Bathroom Upgrade',
      status: 'Completed',
      type: 'Renovation',
      startDate: '2024-01-10',
      budget: 15000,
      progress: 100,
      contractor: 'Modern Builders',
      location: 'New York, NY',
      description: 'Luxury bathroom renovation with premium fixtures',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400'
    },
    {
      id: 3,
      title: 'Living Room Design',
      status: 'Planning',
      type: 'Interior Design',
      startDate: '2024-06-01',
      budget: 8000,
      progress: 15,
      contractor: 'Design Studio Pro',
      location: 'New York, NY',
      description: 'Contemporary living room design and furniture selection',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'active' && ['In Progress', 'Planning'].includes(project.status)) ||
      (activeTab === 'completed' && project.status === 'Completed');
    
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.contractor.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
        <p className="text-gray-600">Manage and track all your construction and design projects</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'active', label: 'Active', count: projects.filter(p => ['In Progress', 'Planning'].includes(p.status)).length },
              { key: 'completed', label: 'Completed', count: projects.filter(p => p.status === 'Completed').length },
              { key: 'all', label: 'All Projects', count: projects.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'active' | 'completed' | 'all')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
            {/* Project Image */}
            <div className="relative h-48 bg-gray-200 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              {project.status === 'In Progress' && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="text-white">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm font-semibold">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all duration-500" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Project Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  Started: {new Date(project.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign size={16} className="mr-2" />
                  Budget: ${project.budget.toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User size={16} className="mr-2" />
                  {project.contractor}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  {project.location}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                  <Eye size={16} />
                  <span>View</span>
                </button>
                <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-colors duration-200">
                  <Edit size={16} />
                </button>
                <button className="flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 py-2 px-3 rounded-lg transition-colors duration-200">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Project Card */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors duration-300 group cursor-pointer">
          <div className="p-6 h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-200">
              <Plus size={32} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start New Project</h3>
            <p className="text-sm text-gray-600">Begin your next construction or design project</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first project</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
            Create New Project
          </button>
        </div>
      )}
    </div>
  );
};

export default MyProjectsList; 