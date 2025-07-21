import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp, FaTh, FaList, FaTag } from 'react-icons/fa';
import ServiceCard, { Service } from './ServiceCard';
import { debounce } from 'lodash';

interface ServiceListProps {
  services: Service[];
  title?: string;
  onServiceClick?: (service: Service) => void;
  onServiceFavorite?: (service: Service) => void;
  loading?: boolean;
  error?: string;
}

type SortOption = 'name' | 'price' | 'rating' | 'date';
type SortDirection = 'asc' | 'desc';

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  title,
  onServiceClick,
  onServiceFavorite,
  loading = false,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);
  const [isGridView, setIsGridView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Use fixed categories as per user request
  const categories = useMemo(() => [
    { value: 'construction', label: 'Construction' },
    { value: 'interior', label: 'Interior Design' },
    { value: 'renovation', label: 'Renovation' },
    { value: 'landscaping', label: 'Landscaping' },
  ], []);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
      setCurrentPage(1);
    }, 300),
    []
  );

  // Filter and sort services
  useEffect(() => {
    let result = [...services];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter (multi-select)
    if (selectedCategories.length > 0) {
      result = result.filter(service => selectedCategories.includes(service.category));
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredServices(result);
  }, [services, searchTerm, selectedCategories, sortBy, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Loading services...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50">
        <p className="text-black font-bold mb-4 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors duration-200 font-medium border-2 border-black hover:border-gray-800"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (!services || services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50">
        <h3 className="text-xl font-bold text-black mb-2">No Services Found</h3>
        <p className="text-gray-600">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:px-6 bg-white">
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-black mb-8 mt-6 tracking-tight"
        >
          {title}
        </motion.h2>
      )}

      {/* Controls */}
      <div className="w-full flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="relative">
          <button
            type="button"
            className="flex items-center px-5 py-3 rounded-lg border-2 border-blue-400 bg-white text-blue-700 text-base font-semibold shadow transition-all focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            onClick={() => setIsDropdownOpen(v => !v)}
            style={{ minWidth: 220 }}
          >
            <FaTag className="mr-2 text-blue-500" />
            {selectedCategories.length === 0 ? 'All Categories' : categories.filter(cat => selectedCategories.includes(cat.value)).map(cat => cat.label).join(', ')}
            <span className="ml-auto text-blue-400">▼</span>
          </button>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="absolute left-0 mt-2 w-64 bg-white border-2 border-blue-400 rounded-lg shadow-lg z-20 p-3"
              >
                {categories.map(cat => (
                  <label key={cat.value} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.value)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedCategories(prev => [...prev, cat.value]);
                        } else {
                          setSelectedCategories(prev => prev.filter(v => v !== cat.value));
                        }
                      }}
                      className="accent-blue-500"
                    />
                    <span className="text-gray-800">{cat.label}</span>
                  </label>
                ))}
                <button
                  type="button"
                  className="mt-3 w-full py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                  onClick={() => setSelectedCategories([])}
                >
                  Clear All
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="hidden md:block h-10 border-l-2 border-gray-200 mx-4" />
        <div className="flex-1 flex items-center">
          <div className="flex items-center bg-white rounded-lg border-2 border-gray-300 px-4 py-3 shadow-sm hover:border-black transition-colors duration-200 w-full">
            <FaSearch className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Search for services..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="outline-none border-none bg-transparent text-base w-40 md:w-64 text-black placeholder-gray-500 flex-1"
            />
          </div>
        </div>
      </div>

      {/* Filter Button */}
      <button className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white hover:bg-gray-100 text-black font-medium border-2 border-gray-300 hover:border-black transition-all duration-200">
        <FaFilter className="text-black" /> 
        Filters
      </button>

      {/* View Toggle */}
      <div className="flex gap-2 ml-2 border-2 border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsGridView(true)}
          className={`p-3 transition-all duration-200 ${
            isGridView 
              ? 'bg-black text-white' 
              : 'bg-white text-black hover:bg-gray-100'
          }`}
          title="Grid View"
        >
          <FaTh />
        </button>
        <button
          onClick={() => setIsGridView(false)}
          className={`p-3 transition-all duration-200 ${
            !isGridView 
              ? 'bg-black text-white' 
              : 'bg-white text-black hover:bg-gray-100'
          }`}
          title="List View"
        >
          <FaList />
        </button>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center ml-2 gap-2">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-black text-sm focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 font-medium"
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="date">Date</option>
        </select>
        <button
          onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="p-3 rounded-lg bg-white hover:bg-gray-100 text-black border-2 border-gray-300 hover:border-black transition-all duration-200"
          title="Sort Direction"
        >
          {sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
        </button>
      </div>

      {/* Service Cards Grid/List */}
      <motion.div
        className={isGridView ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08
            }
          }
        }}
      >
        <AnimatePresence>
          {paginatedServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onClick={onServiceClick}
              onFavorite={onServiceFavorite}
              viewMode={isGridView ? 'grid' : 'list'}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all duration-200 ${
                currentPage === i + 1 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-gray-300 hover:bg-gray-100 hover:border-black'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceList;