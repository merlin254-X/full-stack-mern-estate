/**
 * Home.jsx  –  East Bridge Developers
 * Full-width cinematic hero + strong black divider
 */

import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Home as HomeIcon, Key } from 'lucide-react';
import ListingItem from '../component/ListingItem';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  },
});

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
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

function SectionHeading({ eyebrow, title, link, linkTo }) {
  return (
    <div className="flex items-end justify-between mb-10">
      <div>
        <p className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-2">
          {eyebrow}
        </p>
        <h2
          className="text-3xl sm:text-4xl font-semibold text-slate-900"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h2>
      </div>
      {link && (
        <Link
          to={linkTo}
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 group transition-colors"
        >
          {link}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  const HERO_IMAGE =
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=80';

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [offerRes, rentRes, saleRes] = await Promise.all([
          fetch('/api/listing/get?offer=true&limit=6'),
          fetch('/api/listing/get?type=rent&limit=4'),
          fetch('/api/listing/get?type=sale&limit=4'),
        ]);
        const [offerData, rentData, saleData] = await Promise.all([
          offerRes.json(),
          rentRes.json(),
          saleRes.json(),
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
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="bg-[#f8f6f1]">

      {/* ════════════════════════════════════════════════
          FULL-WIDTH CINEMATIC HERO
      ════════════════════════════════════════════════ */}
      <section className="relative h-[92vh] min-h-[680px] w-full overflow-hidden">
        {/* Big Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
          <motion.div initial="hidden" animate="show" className="max-w-3xl">
            <motion.div variants={stagger(0.1)} className="flex items-center gap-2 mb-6">
              <Sparkles size={16} className="text-amber-400" />
              <span className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">
                East Bridge Developers
              </span>
            </motion.div>

            <motion.h1
              variants={stagger(0.2)}
              className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-white leading-[1.08] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Find Where
              <br />
              <span className="text-amber-400">Life</span> Happens.
            </motion.h1>

            <motion.p
              variants={stagger(0.3)}
              className="text-white/80 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed"
            >
              Curated properties across East Africa. Transparent pricing.
              A seamless journey from search to keys in hand.
            </motion.p>

            <motion.div variants={stagger(0.4)} className="flex flex-wrap items-center gap-4">
              <Link to="/search">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-semibold px-8 py-4 rounded-full text-sm shadow-xl shadow-amber-500/20 transition-all"
                >
                  Explore Listings <ArrowRight size={16} />
                </motion.button>
              </Link>

              <Link to="/search?offer=true">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md text-white font-medium px-8 py-4 rounded-full text-sm border border-white/25 transition-all"
                >
                  View Offers
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Strong black section divider */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#f8f6f1] to-transparent pointer-events-none" />
      </section>

      {/* ════════════════════════════════════════════════
          CATEGORY CARDS
      ════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 grid sm:grid-cols-2 gap-5 mb-20">
          {[
            {
              icon: <Key size={22} className="text-amber-600" />,
              label: 'Rent',
              desc: 'Flexible leases in prime neighbourhoods.',
              to: '/search?type=rent',
              bg: 'bg-white',
              dark: false,
            },
            {
              icon: <HomeIcon size={22} className="text-amber-400" />,
              label: 'Buy',
              desc: "Find the home you'll never want to leave.",
              to: '/search?type=sale',
              bg: 'bg-slate-900',
              dark: true,
            },
          ].map(({ icon, label, desc, to, bg, dark }, i) => (
            <motion.div
              key={label}
              variants={stagger(i * 0.1)}
              className={`${bg} rounded-[1.75rem] p-8 sm:p-10 flex flex-col gap-4 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border ${
                dark ? 'border-slate-800' : 'border-slate-100'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  dark ? 'bg-white/10' : 'bg-amber-50'
                }`}
              >
                {icon}
              </div>
              <div className="mt-1">
                <h3
                  className={`text-2xl font-semibold mb-2 ${
                    dark ? 'text-white' : 'text-slate-900'
                  }`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {label}
                </h3>
                <p className={`text-base ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {desc}
                </p>
              </div>
              <Link
                to={to}
                className={`mt-auto inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all ${
                  dark ? 'text-amber-400' : 'text-amber-600'
                }`}
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
          BOTTOM CTA
      ════════════════════════════════════════════════ */}
      <AnimatedSection>
        <motion.section
          variants={fadeUp}
          className="bg-slate-900 mx-4 mb-12 rounded-[2.5rem] px-8 py-20 text-center max-w-7xl lg:mx-auto relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-4">
              Ready to start?
            </p>
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
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-semibold px-10 py-4 rounded-full text-sm transition-colors shadow-lg shadow-amber-500/20"
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