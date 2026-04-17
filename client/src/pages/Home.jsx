/**
 * Home.jsx  –  East Bridge Real Estates
 * ─────────────────────────────────
 * Deps: framer-motion, lucide-react, swiper
 * Fonts (add to index.html <head>):
 * <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
 */

import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Home as HomeIcon, Key, MapPin } from 'lucide-react';

import SwiperCore from 'swiper';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import 'swiper/css/effect-fade';

import ListingItem from '../component/ListingItem';

SwiperCore.use([Navigation, Autoplay, EffectFade]);

/* ─── animation variants ───────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] } },
});

/* ─── section wrapper with in-view trigger ─────────────────────── */
function AnimatedSection({ children, className = '' }) {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── stat badge (Updated for Light Background) ────────────────── */
function StatBadge({ value, label }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
        {value}
      </span>
      <span className="text-gray-500 text-xs font-semibold tracking-wider uppercase">{label}</span>
    </div>
  );
}

/* ─── section heading ──────────────────────────────────────────── */
function SectionHeading({ eyebrow, title, link, linkTo }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <p className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-2">{eyebrow}</p>
        <h2
          className="text-3xl sm:text-4xl font-semibold text-gray-900"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h2>
      </div>
      {link && (
        <Link
          to={linkTo}
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 group transition-colors"
        >
          {link}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings,  setSaleListings]  = useState([]);
  const [rentListings,  setRentListings]  = useState([]);
  const [heroLoaded,    setHeroLoaded]    = useState(false);
  const [activeSlide,   setActiveSlide]   = useState(0);

  // Aesthetic Fallback Image
  const defaultAestheticImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [offerRes, rentRes, saleRes] = await Promise.all([
          fetch('/api/listing/get?offer=true&limit=6'),
          fetch('/api/listing/get?type=rent&limit=4'),
          fetch('/api/listing/get?type=sale&limit=4'),
        ]);
        const [offerData, rentData, saleData] = await Promise.all([
          offerRes.json(), rentRes.json(), saleRes.json(),
        ]);
        setOfferListings(offerData);
        setRentListings(rentData);
        setSaleListings(saleData);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      }
    };
    fetchAll();
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="bg-[#f8f6f1] overflow-hidden">

      {/* ════════════════════════════════════════════════
          HERO  –  Modern Editorial Split Layout
      ════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-12 lg:pt-36 lg:pb-24 max-w-[90rem] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left: Typography & CTAs */}
          <div className="relative z-20 flex flex-col justify-center order-2 lg:order-1 pt-8 lg:pt-0">
            <AnimatePresence>
              <motion.div 
                initial="hidden" 
                animate="show" 
                onAnimationComplete={() => setHeroLoaded(true)}
              >
                {/* eyebrow */}
                <motion.div
                  variants={stagger(0.1)}
                  className="flex items-center gap-2 mb-6"
                >
                  <Sparkles size={16} className="text-amber-500" />
                  <span className="text-amber-600 text-xs font-bold tracking-widest uppercase">
                    East Bridge Real Estates
                  </span>
                </motion.div>

                {/* headline */}
                <div className="overflow-hidden mb-6">
                  <motion.h1
                    variants={stagger(0.2)}
                    className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-gray-900 leading-[1.1]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Find Where <br />
                    <em className="text-amber-500 not-italic">Life</em> Happens.
                  </motion.h1>
                </div>

                {/* sub-copy */}
                <motion.p
                  variants={stagger(0.3)}
                  className="text-gray-600 text-lg max-w-md mb-10 font-normal leading-relaxed"
                >
                  Curated properties, transparent pricing, and a seamless journey from search to keys in hand.
                </motion.p>

                {/* CTAs */}
                <motion.div variants={stagger(0.4)} className="flex flex-wrap items-center gap-4">
                  <Link to="/search">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-4 rounded-full text-sm shadow-xl shadow-gray-900/20 transition-all"
                    >
                      Explore Listings <ArrowRight size={16} />
                    </motion.button>
                  </Link>
                  <Link to="/search?offer=true">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 bg-transparent text-gray-900 font-medium px-8 py-4 rounded-full text-sm border border-gray-300 hover:border-gray-900 transition-colors"
                    >
                      View Offers
                    </motion.button>
                  </Link>
                </motion.div>

                {/* stats row */}
                <motion.div
                  variants={stagger(0.5)}
                  className="flex gap-12 mt-16 pt-10 border-t border-gray-200/60"
                >
                  <StatBadge value="2.4k" label="Listings" />
                  <StatBadge value="98%"  label="Satisfaction" />
                  <StatBadge value="14"   label="Years Exp." />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Contained Image/Swiper */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-1 lg:order-2 h-[450px] sm:h-[550px] lg:h-[700px] w-full rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <Swiper
              effect="fade"
              autoplay={{ delay: 5500, disableOnInteraction: false }}
              loop
              speed={1000}
              onSlideChange={(s) => setActiveSlide(s.realIndex)}
              className="absolute inset-0 w-full h-full"
            >
              {offerListings.length > 0
                ? offerListings.map((listing) => (
                    <SwiperSlide key={listing._id}>
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${listing.imageUrls[0]})` }}
                      />
                    </SwiperSlide>
                  ))
                : (
                  <SwiperSlide>
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${defaultAestheticImage})` }}
                    />
                  </SwiperSlide>
                )
              }
            </Swiper>

            {/* Aesthetic Floating Badge */}
            <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-white/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                 <MapPin size={18} className="text-amber-600" />
              </div>
              <div>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Featured</p>
                 <p className="text-sm font-semibold text-gray-900">Modern Luxury Escapes</p>
              </div>
            </div>

            {/* Slide counter indicator */}
            {offerListings.length > 0 && (
              <div className="absolute top-6 right-6 z-20 bg-black/30 backdrop-blur-md text-white text-xs font-mono px-3 py-1.5 rounded-full">
                {String(activeSlide + 1).padStart(2, '0')} / {String(offerListings.length).padStart(2, '0')}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          CATEGORY CARDS
      ════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid sm:grid-cols-2 gap-5">
          {[
            {
              icon: <Key size={22} className="text-amber-600" />,
              label: 'Rent',
              desc:  'Flexible leases in prime neighbourhoods.',
              to:    '/search?type=rent',
              bg:    'bg-white',
            },
            {
              icon: <HomeIcon size={22} className="text-amber-400" />,
              label: 'Buy',
              desc:  "Find the home you'll never want to leave.",
              to:    '/search?type=sale',
              bg:    'bg-gray-900',
              dark:   true,
            },
          ].map(({ icon, label, desc, to, bg, dark }, i) => (
            <motion.div
              key={label}
              variants={stagger(i * 0.1)}
              className={`${bg} rounded-[2rem] p-8 sm:p-10 flex flex-col gap-4 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border ${dark ? 'border-gray-800' : 'border-gray-100'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${dark ? 'bg-white/10' : 'bg-amber-50'}`}>
                {icon}
              </div>
              <div className="mt-2">
                <h3 className={`text-2xl font-semibold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                  {label}
                </h3>
                <p className={`text-base ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
              </div>
              <Link
                to={to}
                className={`mt-auto inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all ${dark ? 'text-amber-400' : 'text-amber-600'}`}
              >
                Browse Properties <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </section>
      </AnimatedSection>

      {/* ════════════════════════════════════════════════
          LISTING SECTIONS
      ════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 pb-28 flex flex-col gap-24">

        {/* Recent Offers */}
        {offerListings.length > 0 && (
          <AnimatedSection>
            <motion.div variants={fadeUp}>
              <SectionHeading
                eyebrow="Hot Deals"
                title="Recent Offers"
                link="View all offers"
                linkTo="/search?offer=true"
              />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {offerListings.map((listing, i) => (
                  <motion.div key={listing._id} variants={stagger(i * 0.06)}>
                    <ListingItem listing={listing} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatedSection>
        )}

        {/* For Rent */}
        {rentListings.length > 0 && (
          <AnimatedSection>
            <motion.div variants={fadeUp}>
              <SectionHeading
                eyebrow="Rental Homes"
                title="Places for Rent"
                link="View all rentals"
                linkTo="/search?type=rent"
              />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {rentListings.map((listing, i) => (
                  <motion.div key={listing._id} variants={stagger(i * 0.06)}>
                    <ListingItem listing={listing} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatedSection>
        )}

        {/* For Sale */}
        {saleListings.length > 0 && (
          <AnimatedSection>
            <motion.div variants={fadeUp}>
              <SectionHeading
                eyebrow="Properties"
                title="Places for Sale"
                link="View all properties"
                linkTo="/search?type=sale"
              />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {saleListings.map((listing, i) => (
                  <motion.div key={listing._id} variants={stagger(i * 0.06)}>
                    <ListingItem listing={listing} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatedSection>
        )}
      </div>

      {/* ════════════════════════════════════════════════
          BOTTOM CTA BAND
      ════════════════════════════════════════════════ */}
      <AnimatedSection>
        <motion.section
          variants={fadeUp}
          className="bg-gray-900 mx-4 mb-12 rounded-[2.5rem] px-8 py-20 text-center max-w-7xl lg:mx-auto relative overflow-hidden"
        >
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <p className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-4">Ready to start?</p>
            <h2
              className="text-3xl sm:text-5xl font-semibold text-white mb-8 max-w-2xl mx-auto leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your perfect home is one search away.
            </h2>
            <Link to="/search">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold px-10 py-4 rounded-full text-sm transition-colors shadow-lg shadow-amber-500/20"
              >
                Start Searching <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        </motion.section>
      </AnimatedSection>

    </div>
  );
}