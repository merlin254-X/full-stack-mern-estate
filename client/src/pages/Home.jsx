/**
 * Home.jsx  –  East Bridge Real Estates
 * ─────────────────────────────────
 * Deps: framer-motion, lucide-react, swiper
 * Fonts (add to index.html <head>):
 *   <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
 */

import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Home as HomeIcon, Key } from 'lucide-react';

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

/* ─── stat badge ───────────────────────────────────────────────── */
function StatBadge({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
        {value}
      </span>
      <span className="text-white/40 text-xs font-medium tracking-wide uppercase">{label}</span>
    </div>
  );
}

/* ─── section heading ──────────────────────────────────────────── */
function SectionHeading({ eyebrow, title, link, linkTo }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-2">{eyebrow}</p>
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

  /* hero text lines */
  const heroWords = ['Find', 'Where', 'Life', 'Happens.'];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="bg-[#f8f6f1]">

      {/* ════════════════════════════════════════════════
          HERO  –  full-bleed Swiper with dark overlay
      ════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[600px] flex flex-col overflow-hidden">

        {/* Background Swiper */}
        <Swiper
          effect="fade"
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          loop
          speed={1200}
          onSlideChange={(s) => setActiveSlide(s.realIndex)}
          onInit={() => setHeroLoaded(true)}
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
                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700" />
              </SwiperSlide>
            )
          }
        </Swiper>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 z-10" />

        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Hero content */}
        <div className="relative z-20 flex flex-col justify-end h-full max-w-7xl mx-auto px-6 pb-20">
          <AnimatePresence>
            {heroLoaded && (
              <motion.div initial="hidden" animate="show">
                {/* eyebrow */}
                <motion.div
                  variants={stagger(0.1)}
                  className="flex items-center gap-2 mb-6"
                >
                  <Sparkles size={14} className="text-amber-400" />
                  <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">
                    East Bridge Real Estates
                  </span>
                </motion.div>

                {/* headline */}
                <div className="overflow-hidden mb-8">
                  <motion.h1
                    variants={stagger(0.2)}
                    className="text-5xl sm:text-7xl lg:text-8xl font-semibold text-white leading-[1.05] max-w-3xl"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Find Where<br />
                    <em className="text-amber-400 not-italic">Life</em> Happens.
                  </motion.h1>
                </div>

                {/* sub-copy */}
                <motion.p
                  variants={stagger(0.35)}
                  className="text-white/60 text-base sm:text-lg max-w-xl mb-10 font-light leading-relaxed"
                >
                  Curated properties, transparent pricing, and a seamless journey from
                  search to keys in hand.
                </motion.p>

                {/* CTAs */}
                <motion.div variants={stagger(0.45)} className="flex flex-wrap gap-4">
                  <Link to="/search">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-semibold px-8 py-4 rounded-full text-sm transition-colors"
                    >
                      Explore Listings <ArrowRight size={16} />
                    </motion.button>
                  </Link>
                  <Link to="/search?offer=true">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium px-8 py-4 rounded-full text-sm border border-white/20 transition-colors"
                    >
                      View Offers
                    </motion.button>
                  </Link>
                </motion.div>

                {/* stats row */}
                <motion.div
                  variants={stagger(0.55)}
                  className="flex gap-10 mt-16 pt-10 border-t border-white/10"
                >
                  <StatBadge value="2,400+" label="Active Listings" />
                  <StatBadge value="98%"    label="Client Satisfaction" />
                  <StatBadge value="14yrs"  label="In Business" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Slide counter */}
        {offerListings.length > 0 && (
          <div className="absolute bottom-6 right-6 z-20 text-white/40 text-xs font-mono">
            {String(activeSlide + 1).padStart(2, '0')} / {String(offerListings.length).padStart(2, '0')}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════
          CATEGORY CARDS
      ════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-6 py-20 grid sm:grid-cols-2 gap-5">
          {[
            {
              icon: <Key size={22} className="text-amber-500" />,
              label: 'Rent',
              desc:  'Flexible leases in prime neighbourhoods.',
              to:    '/search?type=rent',
              bg:    'bg-white',
            },
            {
              icon: <HomeIcon size={22} className="text-amber-500" />,
              label: 'Buy',
              desc:  "Find the home you'll never want to leave.",
              to:    '/search?type=sale',
              bg:    'bg-[#0c1117]',
              dark:   true,
            },
          ].map(({ icon, label, desc, to, bg, dark }, i) => (
            <motion.div
              key={label}
              variants={stagger(i * 0.1)}
              className={`${bg} rounded-2xl p-8 flex flex-col gap-4 group hover:shadow-2xl transition-shadow duration-300`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">{icon}</div>
              <div>
                <h3 className={`text-xl font-semibold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                  {label}
                </h3>
                <p className={`text-sm font-light ${dark ? 'text-white/50' : 'text-gray-500'}`}>{desc}</p>
              </div>
              <Link
                to={to}
                className={`mt-auto inline-flex items-center gap-1.5 text-sm font-medium group-hover:gap-3 transition-all ${dark ? 'text-amber-400' : 'text-amber-600'}`}
              >
                Browse <ArrowRight size={14} />
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
              <div className="mt-6 sm:hidden text-center">
                <Link to="/search?offer=true" className="text-sm font-medium text-amber-600 inline-flex items-center gap-1">
                  View all offers <ArrowRight size={13} />
                </Link>
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
          className="bg-[#0c1117] mx-4 mb-12 rounded-3xl px-8 py-16 text-center max-w-7xl lg:mx-auto"
        >
          <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-4">Ready to start?</p>
          <h2
            className="text-3xl sm:text-5xl font-semibold text-white mb-6 max-w-xl mx-auto leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your perfect home is one search away.
          </h2>
          <Link to="/search">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-semibold px-10 py-4 rounded-full text-sm transition-colors mt-2"
            >
              Start Searching <ArrowRight size={16} />
            </motion.button>
          </Link>
        </motion.section>
      </AnimatedSection>

    </div>
  );
}
