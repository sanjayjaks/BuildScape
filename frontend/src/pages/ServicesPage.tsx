import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import ServiceList from '../components/services/ServiceList';
import { Service } from '../components/services/ServiceCard';
import SearchFilter from '../components/services/SearchFilter';
import { FaFilter, FaSortAmountDown, FaSortAmountUp, FaSearch, FaTh, FaList } from 'react-icons/fa';
import FilterPanel from '../components/services/FilterPanel';
import ServiceCard from '../components/services/ServiceCard';

// Types
interface ServiceFilters {
  search?: string;
  category?: string;
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  provider?: string;
  tags?: string[];
  amenities?: string[];
  availability?: {
    minDate: string;
    maxDate: string;
  };
  reviews?: {
    minCount: number;
    maxCount: number;
  };
  insurance?: {
    provider: string;
  };
  certifications?: string[];
  portfolio?: {
    images: string[];
  };
  sortBy?: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'recent';
}

interface ServiceProvider {
  id: string;
  name: string;
  rating: number;
  specialties?: string[];
  yearsOfExperience?: number;
  completedProjects?: number;
  location?: string;
  certifications?: string[];
  image: string;
  phone: string;
}

interface EnhancedService extends Service {
  tags: string[];
  amenities: string[];
  reviews: {
    count: number;
    average: number;
  };
  availability?: {
    nextAvailable: Date;
  };
  insurance?: {
    provider: string;
    coverage: string;
  };
  certifications?: string[];
  portfolio?: {
    images: string[];
  };
  provider: ServiceProvider;
}

// Mock data generation with expanded services
const generateMockServices = async (): Promise<EnhancedService[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Indian city names
  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad',
    'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara'
  ];

  // Helper to generate random Indian phone number
  const randomPhone = () => {
    const prefix = '+91';
    const number = Math.floor(9000000000 + Math.random() * 1000000000);
    return `${prefix} ${number}`;
  };

  return Array.from({ length: 12 }, (_, i) => ({
    id: `service-${i + 1}`,
    name: `Service ${i + 1}`,
    description: `This is a description for service ${i + 1}`,
    category: ['construction', 'renovation', 'interior', 'landscaping'][i % 4],
    price: Math.floor(Math.random() * 1000) + 100,
    rating: Math.floor(Math.random() * 5) + 1,
    image: `https://source.unsplash.com/random/400x300?construction=${i}`,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    location: {
      city: indianCities[i % indianCities.length],
      state: 'StateName',
      country: 'India',
    },
    tags: ['Professional', 'Experienced', 'Reliable'].slice(0, Math.floor(Math.random() * 3) + 1),
    amenities: ['Free Consultation', 'Warranty', 'Insurance'].slice(0, Math.floor(Math.random() * 3) + 1),
    reviews: {
      count: Math.floor(Math.random() * 100) + 1,
      average: Math.floor(Math.random() * 5) + 1
    },
    availability: {
      nextAvailable: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
    },
    insurance: {
      provider: ['AllState', 'StateFarm', 'Progressive'][i % 3],
      coverage: 'Full Coverage'
    },
    certifications: ['Licensed', 'Bonded', 'Insured'].slice(0, Math.floor(Math.random() * 3) + 1),
    portfolio: {
      images: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => 
        `https://source.unsplash.com/random/400x300?construction=${i}-${j}`
      )
    },
    provider: {
      id: `provider-${i + 1}`,
      name: `Provider ${i + 1}`,
      rating: Math.floor(Math.random() * 5) + 1,
      image: `https://source.unsplash.com/random/100x100?portrait=${i}`,
      phone: randomPhone(),
    }
  }));
};

const ServicesPage = () => {
  const [services, setServices] = useState<EnhancedService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<ServiceFilters>({});

  // Add Service modal state and logic
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    image: null as File | null,
    imageUrl: '',
  });
  const [formError, setFormError] = useState('');

  const handleFiltersChange = (newFilters: Partial<ServiceFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const servicesData = await generateMockServices();
      setServices(servicesData);
      setLoading(false);
    };

    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Search filter
      const matchesSearch = !filters.search || 
        service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        service.description.toLowerCase().includes(filters.search.toLowerCase());

      // Category filter
      const matchesCategory = !filters.category || service.category === filters.category;

      // Location filter (partial match, case-insensitive)
      const matchesLocation = !filters.location || (
        service.location &&
        (
          (typeof service.location.city === 'string' && service.location.city.toLowerCase().includes(filters.location!.toLowerCase())) ||
          (typeof service.location.state === 'string' && service.location.state.toLowerCase().includes(filters.location!.toLowerCase())) ||
          (typeof service.location.country === 'string' && service.location.country.toLowerCase().includes(filters.location!.toLowerCase()))
        )
      );

      // Price range filter
      const matchesPrice = !filters.priceRange || (
        service.price >= filters.priceRange.min && 
        service.price <= filters.priceRange.max
      );

      // Minimum rating filter
      const matchesRating = !filters.rating || service.rating >= filters.rating;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesPrice &&
        matchesRating
      );
    });
  }, [services, filters]);

  const handleOpenModal = () => {
    setForm({ name: '', description: '', category: '', price: '', image: null, imageUrl: '' });
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
    if (!form.name.trim() || !form.description.trim() || !form.category.trim() || !form.price.trim()) {
      setFormError('All fields are required.');
      return;
    }
    const newService = {
      id: `s${Date.now()}`,
      name: form.name,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      rating: 5,
      image: form.imageUrl,
      date: new Date().toISOString(),
      location: { city: 'Mumbai', state: 'MH', country: 'India' },
      provider: {
        id: 'provider-1',
        name: 'Provider 1',
        rating: 5,
        image: '',
        phone: '+91 9000000000',
      },
      tags: [],
      amenities: [],
      reviews: { count: 0, average: 5 },
      variant: 'default' as const,
    };
    setServices(prev => [newService, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        <h1 className="text-4xl font-bold mb-4">Find the Perfect Service</h1>
        <p className="text-lg mb-8">Discover and connect with top-rated service providers for all your construction and interior needs.</p>
        
        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Search for services..."
            className="w-full px-6 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            value={filters.search}
            onChange={(e) => handleFiltersChange({ search: e.target.value })}
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <FaFilter />
              <span>Filters</span>
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
              >
                <FaTh />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
              >
                <FaList />
              </button>
            </div>
          </div>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFiltersChange({ sortBy: e.target.value as ServiceFilters['sortBy'] })}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="relevance">Most Relevant</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
        />

        {/* Services Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
            <AnimatePresence mode="wait">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  viewMode={viewMode}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage; 