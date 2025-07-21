import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrashAlt } from 'react-icons/fa';

interface FilterPanelProps {
  filters: {
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
  };
  onFiltersChange: (filters: Partial<FilterPanelProps['filters']>) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
}) => {
  const handleClearFilters = () => {
    onFiltersChange({
      category: undefined,
      location: undefined,
      priceRange: { min: 0, max: 1000000 },
      rating: undefined,
    });
  };

  // Default values for price range to avoid issues with uncontrolled components
  const currentPriceRange = filters.priceRange || { min: 0, max: 1000000 };

  return (
    <>
      <style>
        {`
          /* Import professional fonts */
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Source+Sans+Pro:wght@400;600&display=swap');

          /* Variables for professional theming */
          :root {
            --primary-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            --secondary-font: 'Source Sans Pro', sans-serif;
            
            --color-black: #000000;
            --color-white: #ffffff;
            --color-gray-50: #f9fafb;
            --color-gray-100: #f3f4f6;
            --color-gray-200: #e5e7eb;
            --color-gray-300: #d1d5db;
            --color-gray-400: #9ca3af;
            --color-gray-500: #6b7280;
            --color-gray-600: #4b5563;
            --color-gray-700: #374151;
            --color-gray-800: #1f2937;
            --color-gray-900: #111827;
            
            --panel-width: 320px;
            --border-radius: 6px;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          }

          .professional-filter-panel {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            width: var(--panel-width);
            background-color: var(--color-white);
            border-right: 1px solid var(--color-gray-200);
            box-shadow: var(--shadow-xl);
            z-index: 1000;
            overflow-y: auto;
            overflow-x: hidden;
            font-family: var(--primary-font);
            color: var(--color-gray-900);
          }

          /* Custom scrollbar */
          .professional-filter-panel::-webkit-scrollbar {
            width: 6px;
          }

          .professional-filter-panel::-webkit-scrollbar-track {
            background: var(--color-gray-50);
          }

          .professional-filter-panel::-webkit-scrollbar-thumb {
            background-color: var(--color-gray-300);
            border-radius: 3px;
            transition: background-color 0.2s ease;
          }

          .professional-filter-panel::-webkit-scrollbar-thumb:hover {
            background-color: var(--color-gray-400);
          }

          .professional-filter-panel-content {
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .professional-filter-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--color-gray-200);
            margin-bottom: 8px;
          }

          .professional-filter-title {
            font-family: var(--primary-font);
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--color-black);
            letter-spacing: -0.025em;
            margin: 0;
          }

          .professional-close-button {
            background: var(--color-white);
            border: 1px solid var(--color-gray-300);
            color: var(--color-gray-600);
            width: 32px;
            height: 32px;
            border-radius: var(--border-radius);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            padding: 0;
          }

          .professional-close-button:hover,
          .professional-close-button:focus {
            background: var(--color-gray-50);
            border-color: var(--color-gray-400);
            color: var(--color-gray-800);
            box-shadow: var(--shadow-sm);
          }

          .professional-close-button:active {
            transform: translateY(0.5px);
            box-shadow: none;
          }

          .professional-close-button svg {
            width: 16px;
            height: 16px;
          }

          .professional-filter-group {
            margin-bottom: 0;
          }

          .professional-filter-label {
            display: block;
            font-family: var(--primary-font);
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--color-gray-700);
            margin-bottom: 8px;
            line-height: 1.25;
          }

          .professional-input,
          .professional-select {
            width: 100%;
            padding: 10px 12px;
            background-color: var(--color-white);
            border: 1px solid var(--color-gray-300);
            border-radius: var(--border-radius);
            color: var(--color-gray-900);
            font-family: var(--primary-font);
            font-size: 0.875rem;
            line-height: 1.25;
            transition: all 0.2s ease;
            box-sizing: border-box;
            outline: none;
          }

          .professional-input::placeholder {
            color: var(--color-gray-400);
            font-style: normal;
          }

          .professional-input:focus,
          .professional-select:focus {
            border-color: var(--color-black);
            box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
            background-color: var(--color-white);
          }

          .professional-input:hover,
          .professional-select:hover {
            border-color: var(--color-gray-400);
          }

          /* Number input styling */
          .professional-input[type="number"]::-webkit-inner-spin-button,
          .professional-input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          .professional-input[type="number"] {
            -moz-appearance: textfield;
          }

          .professional-select {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 8px center;
            background-repeat: no-repeat;
            background-size: 16px;
            padding-right: 36px;
            cursor: pointer;
          }

          .professional-select option {
            background-color: var(--color-white);
            color: var(--color-gray-900);
            font-family: var(--primary-font);
            padding: 8px 12px;
          }

          .professional-input-group {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .professional-input-separator {
            font-family: var(--primary-font);
            color: var(--color-gray-400);
            font-size: 0.875rem;
            font-weight: 500;
            user-select: none;
          }

          .professional-clear-button {
            width: 100%;
            padding: 12px 16px;
            background: var(--color-black);
            color: var(--color-white);
            border: 1px solid var(--color-black);
            border-radius: var(--border-radius);
            font-family: var(--primary-font);
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            outline: none;
          }

          .professional-clear-button:hover,
          .professional-clear-button:focus {
            background: var(--color-gray-800);
            border-color: var(--color-gray-800);
            box-shadow: var(--shadow-md);
          }

          .professional-clear-button:active {
            transform: translateY(0.5px);
            box-shadow: var(--shadow-sm);
          }

          .professional-clear-button svg {
            width: 16px;
            height: 16px;
          }

          /* Focus visible for accessibility */
          .professional-close-button:focus-visible,
          .professional-input:focus-visible,
          .professional-select:focus-visible,
          .professional-clear-button:focus-visible {
            outline: 2px solid var(--color-black);
            outline-offset: 2px;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .professional-filter-panel {
              width: 100%;
              max-width: var(--panel-width);
            }
            
            .professional-filter-panel-content {
              padding: 16px;
              gap: 20px;
            }
          }
        `}
      </style>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="professional-filter-panel"
          >
            <div className="professional-filter-panel-content">
              <div className="professional-filter-header">
                <h2 className="professional-filter-title">Filters</h2>
                <button
                  onClick={onToggle}
                  className="professional-close-button"
                  aria-label="Close filters"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Category Filter */}
              <div className="professional-filter-group">
                <label htmlFor="category-filter" className="professional-filter-label">
                  Category
                </label>
                <select
                  id="category-filter"
                  value={filters.category || ''}
                  onChange={(e) => onFiltersChange({ category: e.target.value || undefined })}
                  className="professional-select"
                >
                  <option value="">All Categories</option>
                  <option value="construction">Construction</option>
                  <option value="interior">Interior Design</option>
                  <option value="renovation">Renovation</option>
                  <option value="landscaping">Landscaping</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="professional-filter-group">
                <label className="professional-filter-label">Price Range</label>
                <div className="professional-input-group">
                  <input
                    type="number"
                    placeholder="Min"
                    value={currentPriceRange.min === 0 && !filters.priceRange?.min ? '' : currentPriceRange.min}
                    onChange={(e) => {
                      const min = e.target.value ? Number(e.target.value) : 0;
                      onFiltersChange({
                        priceRange: {
                          ...currentPriceRange,
                          min: min,
                        },
                      });
                    }}
                    className="professional-input"
                  />
                  <span className="professional-input-separator">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={currentPriceRange.max === 1000000 && !filters.priceRange?.max ? '' : currentPriceRange.max}
                    onChange={(e) => {
                      const max = e.target.value ? Number(e.target.value) : 1000000;
                      onFiltersChange({
                        priceRange: {
                          ...currentPriceRange,
                          max: max,
                        },
                      });
                    }}
                    className="professional-input"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="professional-filter-group">
                <label htmlFor="rating-filter" className="professional-filter-label">
                  Minimum Rating
                </label>
                <select
                  id="rating-filter"
                  value={filters.rating || ''}
                  onChange={(e) => onFiltersChange({ rating: e.target.value ? Number(e.target.value) : undefined })}
                  className="professional-select"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="professional-filter-group">
                <label htmlFor="location-filter" className="professional-filter-label">
                  Location
                </label>
                <input
                  id="location-filter"
                  type="text"
                  placeholder="Enter location..."
                  value={filters.location || ''}
                  onChange={(e) => onFiltersChange({ location: e.target.value || undefined })}
                  className="professional-input"
                />
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={handleClearFilters}
                className="professional-clear-button"
              >
                <FaTrashAlt />
                <span>Clear All Filters</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterPanel;