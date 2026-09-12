import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Search, ShieldCheck, MapPin } from 'lucide-react';
import ListingItem from '../component/ListingItem';

const headingFont = "'Playfair Display', Georgia, 'Times New Roman', serif";
const bodyFont = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'show' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, link, linkTo }) {
  return (
    <div className="flex items-end justify-between mb-10">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#C9A227' }}>
          {eyebrow}
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#111111]" style={{ fontFamily: headingFont }}>
          {title}
        </h2>
      </div>
      {link && (
        <Link to={linkTo} className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-black/45 hover:text-[#111111]">
          {link}
          <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

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
        setOfferListings(Array.isArray(offerData) ? offerData : []);
        setRentListings(Array.isArray(rentData) ? rentData : []);
        setSaleListings(Array.isArray(saleData) ? saleData : []);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      }
    };
    fetchAll();
  }, []);

  const liveCount = offerListings.length + rentListings.length + saleListings.length;

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: bodyFont }}>
      <section className="min-h-[100dvh] flex flex-col">
        <div className="pt-24 sm:pt-28 pb-4 sm:pb-5 max-w-5xl mx-auto px-5 text-center shrink-0">
          <h1
            className="text-3xl sm:text-5xl lg:text-[52px] font-semibold text-[#111111] leading-[1.15]"
            style={{ fontFamily: headingFont }}
          >
            Find land and homes across East Africa
          </h1>
          <p className="mt-3 sm:mt-4 text-black/45 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Buy land, book apartments, and sell property in Rwanda and Kenya — with civil-engineering support when you need it.
          </p>
        </div>

        <div className="relative w-full flex-1 min-h-[320px]">
          <img
            src="/old-buildings-port-evening.jpg"
            alt="East Gates featured property"
            className="absolute inset-0 w-full h-full object-cover object-[center_65%]"
          />
          <div className="absolute inset-x-0 top-0 h-28 sm:h-40 bg-gradient-to-b from-white via-white/75 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-40 sm:h-52 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

          <div className="absolute inset-0 flex items-center justify-center gap-3 px-4">
            <Link to="/search" className="px-5 py-2.5 rounded-full bg-white text-[#111111] text-sm font-medium shadow-sm">
              See Properties
            </Link>
            <Link
              to="/search?type=sale"
              className="px-5 py-2.5 rounded-full bg-[#111111] text-white text-sm font-semibold inline-flex items-center gap-1.5"
            >
              Start Searching <ArrowRight size={14} />
            </Link>
          </div>

          <div className="absolute bottom-0 inset-x-0 max-w-6xl mx-auto px-6 sm:px-10 pb-5 sm:pb-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-white">
            {[
              { n: liveCount > 0 ? `${liveCount}+` : 'Live', l: 'Listings shown' },
              { n: 'Kigali', l: 'Nairobi next' },
              { n: 'Sale + Rent', l: 'One platform' },
              { n: '2023', l: 'Started together' },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-xl sm:text-3xl font-semibold" style={{ fontFamily: headingFont }}>
                  {s.n}
                </p>
                <p className="text-[11px] sm:text-sm text-white/70 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div variants={fadeUp}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>
              Reason to choose us
            </p>
            <h2 className="text-3xl sm:text-5xl font-semibold text-[#111111] leading-tight mb-6" style={{ fontFamily: headingFont }}>
              Discover the value behind smart property choices
            </h2>
            <p className="text-black/50 leading-relaxed mb-8 max-w-md">
              We started in 2023 to make land and homes easier to find in Kenya and Rwanda — search, compare, and move from listing to keys without the usual noise.
            </p>
            <Link to="/search" className="inline-flex items-center gap-2 bg-[#111111] text-white text-sm font-semibold px-6 py-3.5 rounded-full">
              Find Your Perfect Property
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-[24px] bg-[#F3F4F6] p-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-5">
                <Search size={16} />
              </div>
              <h3 className="font-semibold text-[#111111] mb-2">Smart search</h3>
              <p className="text-sm text-black/50">Filter sale, rent, and offers across Kigali and Nairobi first.</p>
            </div>
            <div className="rounded-[24px] bg-[#F3F4F6] p-6">
              <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center mb-5">
                <ShieldCheck size={16} />
              </div>
              <h3 className="font-semibold text-[#111111] mb-2">Built by locals</h3>
              <p className="text-sm text-black/50">Software plus civil engineering — listings and site sense together.</p>
            </div>
            <div className="sm:col-span-2 rounded-[24px] bg-[#F3F4F6] p-6 flex flex-col sm:flex-row gap-5 items-start">
              <div className="flex-1">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-5">
                  <MapPin size={16} />
                </div>
                <h3 className="font-semibold text-[#111111] mb-2">Start where it matters</h3>
                <p className="text-sm text-black/50">Kenya and Rwanda first. Land, apartments, and renovation services in one flow.</p>
              </div>
              <img src="/old-buildings-port-evening.jpg" alt="" className="w-full sm:w-40 h-28 object-cover object-[center_65%]" />
            </div>
          </motion.div>
        </section>
      </AnimatedSection>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-24 flex flex-col gap-24">
        {offerListings.length > 0 && (
          <AnimatedSection>
            <SectionHeading eyebrow="Hot deals" title="Recent Offers" link="View all offers" linkTo="/search?offer=true" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </AnimatedSection>
        )}
        {rentListings.length > 0 && (
          <AnimatedSection>
            <SectionHeading eyebrow="Rental homes" title="Places for Rent" link="View all rentals" linkTo="/search?type=rent" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </AnimatedSection>
        )}
        {saleListings.length > 0 && (
          <AnimatedSection>
            <SectionHeading eyebrow="Properties" title="Places for Sale" link="View all properties" linkTo="/search?type=sale" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {saleListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-16">
        <div className="bg-[#111111] rounded-[24px] px-8 py-20 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>
            Ready to start?
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold text-white mb-8 max-w-2xl mx-auto" style={{ fontFamily: headingFont }}>
            Your perfect home is one search away.
          </h2>
          <Link to="/search" className="inline-flex items-center gap-2 bg-[#C9A227] text-[#111111] font-semibold px-10 py-4 rounded-full text-sm">
            Start Searching <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}