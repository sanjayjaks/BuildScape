import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaStar, FaMapMarkerAlt, FaTag, FaShareAlt, FaCalendarAlt, FaCrown, FaGem, FaPhone, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  date: string;
  category: string;
  image?: string;
  provider: {
    id: string;
    name: string;
    rating: number;
    image?: string;
    verified?: boolean;
    completedProjects?: number;
    responseTime?: string;
    phone: string;
  };
  tags?: string[];
  location?: {
    city: string;
    state: string;
    country: string;
  };
  variant?: 'default' | 'premium' | 'featured';
  amenities?: string[];
  certifications?: string[];
  portfolio?: {
    images: string[];
  };
  reviews?: {
    count: number;
    average: number;
  };
  insurance?: {
    provider: string;
    coverage: string;
  };
  availability?: {
    nextAvailable: Date;
  };
}

interface ServiceCardProps {
  service: Service;
  onClick?: (service: Service) => void;
  onFavorite?: (service: Service) => void;
  onShare?: (service: Service) => void;
  viewMode?: 'grid' | 'list';
  showActions?: boolean;
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onClick, 
  onFavorite, 
  onShare,
  viewMode = 'grid',
  showActions = true,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      if (onFavorite) {
        await onFavorite(service);
        toast.success('Service added to favorites');
      }
    } catch (err) {
      setError('Failed to update favorite status');
      toast.error('Failed to update favorite status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      if (onShare) {
        await onShare(service);
        if (navigator.share) {
          await navigator.share({
            title: service.name,
            text: service.description,
            url: window.location.href,
          });
        }
        toast.success('Service shared successfully');
      }
    } catch (err) {
      setError('Failed to share service');
      toast.error('Failed to share service');
    } finally {
      setIsLoading(false);
    }
  };

  // Glassmorphism + gradient + animated border for premium/featured
  const isPremium = service.variant === 'premium';
  const isFeatured = service.variant === 'featured';
  const borderGradient = isPremium
    ? 'from-yellow-400 via-pink-500 to-purple-500'
    : isFeatured
    ? 'from-blue-400 via-cyan-400 to-green-400'
    : 'from-gray-200 to-gray-100';

  return (
    <motion.div
      className={`service-card${viewMode === 'list' ? ' list flex-row' : ''} ${className}`}
      onClick={() => onClick?.(service)}
      whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(0,0,0,0.18)' }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      layout
      style={{
        position: 'relative',
        background: undefined,
        backdropFilter: undefined,
        border: undefined,
        display: viewMode === 'list' ? 'flex' : undefined,
        flexDirection: viewMode === 'list' ? 'row' : undefined,
        alignItems: viewMode === 'list' ? 'stretch' : undefined,
        minHeight: viewMode === 'list' ? 180 : undefined,
      }}
    >
      {/* Animated border for premium/featured */}
      {(isPremium || isFeatured) && (
        <motion.div
          className={`absolute inset-0 z-0 pointer-events-none rounded-3xl border-4 animate-pulse`}
          style={{
            borderImage: `linear-gradient(90deg, ${isPremium ? '#fbbf24,#ec4899,#a21caf' : '#60a5fa,#22d3ee,#22c55e'}) 1`,
            borderStyle: 'solid',
            opacity: 0.7,
          }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}
      {/* Card Content Layer */}
      <div className={viewMode === 'list' ? 'service-card-image-container' : 'service-card-image-container'}
        style={viewMode === 'list' ? { width: 220, minWidth: 180, height: '100%' } : {}}
      >
        <motion.img
          src={service.image || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={service.name}
          className="service-card-image"
          whileHover={{ scale: 1.12 }}
          style={viewMode === 'list' ? { height: '100%', objectFit: 'cover' } : {}}
        />
        {/* Premium/Featured Badge */}
        {isPremium && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-lg text-xs font-bold uppercase">
            <FaCrown className="text-yellow-200" /> Premium
          </div>
        )}
        {isFeatured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-lg text-xs font-bold uppercase">
            <FaGem className="text-white" /> Featured
          </div>
        )}
      </div>
      <div className="service-card-content" style={viewMode === 'list' ? { flex: 1, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' } : {}}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-extrabold text-gray-900 truncate" title={service.name}>{service.name}</h3>
            <span className="text-blue-600 font-bold text-lg drop-shadow">{formatPrice(service.price)}</span>
          </div>
          <p className={`text-gray-700 text-base mb-2 ${viewMode === 'list' ? '' : 'line-clamp-2'}`}>{service.description}</p>
          <div className="flex items-center gap-2 mb-2">
            <FaStar className="text-yellow-400" />
            <span className="text-sm font-semibold text-gray-700">{service.rating}</span>
            <FaMapMarkerAlt className="ml-3 text-gray-400" />
            <span className="text-sm text-gray-500">{service.location?.city || 'N/A'}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {service.tags?.map(tag => (
              <span key={tag} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"><FaTag /> {tag}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <FaCalendarAlt /> <span>{formatDate(service.date)}</span>
          </div>
          {/* Provider */}
          <div className="flex items-center gap-2 mt-2">
            <img src={service.provider.image || 'https://via.placeholder.com/40'} alt={service.provider.name} className="w-8 h-8 rounded-full object-cover border-2 border-blue-100" />
            <span className="text-sm font-semibold text-gray-700">{service.provider.name}</span>
            <span className="text-xs text-gray-500 ml-2">{service.provider.phone}</span>
          </div>
        </div>
        {/* Actions */}
        {showActions && (
          <div className="flex gap-3 mt-4">
            <motion.button 
              onClick={handleFavorite}
              className="p-2 rounded-full bg-white/70 hover:bg-pink-100 text-pink-500 shadow transition"
              disabled={isLoading}
              title="Add to favorites"
              whileTap={{ scale: 0.85 }}
            >
              <FaHeart />
            </motion.button>
            <motion.button 
              onClick={handleShare}
              className="p-2 rounded-full bg-white/70 hover:bg-blue-100 text-blue-500 shadow transition"
              disabled={isLoading}
              title="Share service"
              whileTap={{ scale: 0.85 }}
            >
              <FaShareAlt />
            </motion.button>
            <button
              className="ml-auto px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold hover:from-blue-700 hover:to-blue-500 shadow transition text-sm"
              onClick={e => { e.stopPropagation(); setShowModal(true); }}
            >
              View Details
            </button>
          </div>
        )}
      </div>
      {error && (
        <div className="absolute bottom-2 left-2 bg-red-100 text-red-700 px-3 py-1 rounded shadow text-xs flex items-center gap-2">
          {error}
        </div>
      )}
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-3xl"
          >
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Service Details Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative"
              onClick={e => e.stopPropagation()}
            >
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={() => setShowModal(false)}>
                <FaTimes size={20} />
              </button>
              <div className="flex flex-col items-center mb-4">
                <img src={service.image || 'https://via.placeholder.com/400x300?text=No+Image'} alt={service.name} className="w-48 h-32 object-cover rounded-lg mb-2" />
                <h2 className="text-2xl font-bold mb-1">{service.name}</h2>
                <div className="flex items-center gap-2 mb-2">
                  <FaStar className="text-yellow-400" />
                  <span className="font-semibold text-gray-700">{service.rating}</span>
                  <FaMapMarkerAlt className="ml-3 text-gray-400" />
                  <span className="text-gray-500">{service.location?.city}, {service.location?.state}, {service.location?.country}</span>
                </div>
                <span className="text-blue-600 font-bold text-lg">₹{service.price}</span>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-1">Description</h3>
                <p className="text-gray-700 text-sm">{service.description}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-1">Provider</h3>
                <div className="flex items-center gap-2 mb-1">
                  <img src={service.provider.image || 'https://via.placeholder.com/40'} alt={service.provider.name} className="w-8 h-8 rounded-full object-cover border-2 border-blue-100" />
                  <span className="text-sm font-semibold text-gray-700">{service.provider.name}</span>
                  <FaPhone className="ml-2 text-gray-400" />
                  <span className="text-xs text-gray-500">{service.provider.phone}</span>
                </div>
                <div className="text-xs text-gray-500">Rating: {service.provider.rating}</div>
              </div>
              {service.tags && service.tags.length > 0 && (
                <div className="mb-2">
                  <h3 className="font-semibold text-gray-800 mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map(tag => (
                      <span key={tag} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"><FaTag /> {tag}</span>
                    ))}
                  </div>
                </div>
              )}
              {service.amenities && service.amenities.length > 0 && (
                <div className="mb-2">
                  <h3 className="font-semibold text-gray-800 mb-1">Amenities</h3>
                  <ul className="list-disc list-inside text-xs text-gray-600">
                    {service.amenities.map(a => <li key={a}>{a}</li>)}
                  </ul>
                </div>
              )}
              {service.certifications && service.certifications.length > 0 && (
                <div className="mb-2">
                  <h3 className="font-semibold text-gray-800 mb-1">Certifications</h3>
                  <ul className="list-disc list-inside text-xs text-gray-600">
                    {service.certifications.map(c => <li key={c}>{c}</li>)}
                  </ul>
                </div>
              )}
              {service.portfolio && service.portfolio.images && service.portfolio.images.length > 0 && (
                <div className="mb-2">
                  <h3 className="font-semibold text-gray-800 mb-1">Portfolio</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.portfolio.images.map((img, idx) => (
                      <img key={idx} src={img} alt="Portfolio" className="w-16 h-12 object-cover rounded" />
                    ))}
                  </div>
                </div>
              )}
              {service.reviews && (
                <div className="mb-2">
                  <h3 className="font-semibold text-gray-800 mb-1">Reviews</h3>
                  <div className="text-xs text-gray-600">{service.reviews.count} reviews, average {service.reviews.average} stars</div>
                </div>
              )}
              {service.insurance && (
                <div className="mb-2">
                  <h3 className="font-semibold text-gray-800 mb-1">Insurance</h3>
                  <div className="text-xs text-gray-600">Provider: {service.insurance.provider}, Coverage: {service.insurance.coverage}</div>
                </div>
              )}
              {service.availability && (
                <div className="mb-2">
                  <h3 className="font-semibold text-gray-800 mb-1">Next Available</h3>
                  <div className="text-xs text-gray-600">{service.availability.nextAvailable.toLocaleString()}</div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ServiceCard; 