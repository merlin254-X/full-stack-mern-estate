/**
 * ListingItem.jsx  –  East Bridge Developers
 * ─────────────────────────────────────────
 * Deps: framer-motion, lucide-react
 * Fonts (index.html):
 *   Playfair Display + DM Sans  (see Home.jsx header comment)
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Tag, TrendingDown } from 'lucide-react';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

export default function ListingItem({ listing }) {
  const isRent       = listing.type === 'rent';
  const displayPrice = listing.offer ? listing.discountPrice : listing.regularPrice;
  const savedAmount  = listing.offer ? listing.regularPrice - listing.discountPrice : null;

  return (
    <motion.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-400 border border-gray-100 flex flex-col"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Link to={`/listing/${listing._id}`} className="flex flex-col h-full">

        {/* ── Image ──────────────────────────────────────── */}
        <div className="relative w-full h-52 overflow-hidden bg-gray-100">
          <motion.img
            src={listing.imageUrls?.[0] || PLACEHOLDER}
            alt={listing.name}
            className="w-full h-full object-cover"
            variants={{ rest: { scale: 1 }, hover: { scale: 1.07 } }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* dark vignette at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Type badge */}
          <div className={`
            absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full
            ${isRent
              ? 'bg-blue-600/90 text-white backdrop-blur-sm'
              : 'bg-amber-400/95 text-gray-900 backdrop-blur-sm'}
          `}>
            {isRent ? 'For Rent' : 'For Sale'}
          </div>

          {/* Offer badge */}
          {listing.offer && (
            <motion.div
              variants={{ rest: { opacity: 0, y: 4 }, hover: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.2 }}
              className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-wide px-2.5 py-1.5 rounded-full"
            >
              <TrendingDown size={10} strokeWidth={2.5} />
              Save ${savedAmount?.toLocaleString('en-US')}
            </motion.div>
          )}
        </div>

        {/* ── Content ────────────────────────────────────── */}
        <div className="flex flex-col flex-grow p-5">

          {/* Price */}
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-[11px] font-bold text-gray-400 -translate-y-[1px]">$</span>
            <span
              className="text-2xl font-bold text-gray-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {displayPrice.toLocaleString('en-US')}
            </span>
            {isRent && (
              <span className="text-xs text-gray-400 font-medium ml-0.5">/ mo</span>
            )}
            {listing.offer && (
              <span className="ml-2 text-xs text-gray-400 line-through font-medium">
                ${listing.regularPrice.toLocaleString('en-US')}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-800 truncate mb-1.5 leading-snug">
            {listing.name}
          </h3>

          {/* Address */}
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
            <MapPin size={12} className="text-amber-500 flex-shrink-0" strokeWidth={2.5} />
            <span className="truncate">{listing.address}</span>
          </div>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Footer */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <BedDouble size={14} className="text-gray-400" strokeWidth={1.8} />
              {listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}
            </div>
            <div className="w-px h-3 bg-gray-200" />
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <Bath size={13} className="text-gray-400" strokeWidth={1.8} />
              {listing.bathrooms} {listing.bathrooms === 1 ? 'Bath' : 'Baths'}
            </div>

            {/* view arrow — appears on hover */}
            <motion.div
              variants={{ rest: { opacity: 0, x: -4 }, hover: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.2 }}
              className="ml-auto text-amber-500 text-xs font-semibold flex items-center gap-0.5"
            >
              View →
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
