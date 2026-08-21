import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Listingitem from '../component/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();

      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sticky top-28">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Filters</h2>

              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Search Term */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Search Term
                  </label>
                  <input
                    type="text"
                    id="searchTerm"
                    placeholder="Location, keyword..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition"
                    value={sidebardata.searchTerm}
                    onChange={handleChange}
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-3">
                    Type
                  </label>
                  <div className="space-y-2.5">
                    {[
                      { id: 'all', label: 'Rent & Sale' },
                      { id: 'rent', label: 'Rent' },
                      { id: 'sale', label: 'Sale' },
                    ].map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          id={item.id}
                          className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400/40"
                          onChange={handleChange}
                          checked={sidebardata.type === item.id}
                        />
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 transition">
                          {item.label}
                        </span>
                      </label>
                    ))}

                    <label className="flex items-center gap-3 cursor-pointer group pt-1">
                      <input
                        type="checkbox"
                        id="offer"
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400/40"
                        onChange={handleChange}
                        checked={sidebardata.offer}
                      />
                      <span className="text-sm text-slate-700 group-hover:text-slate-900 transition">
                        Offer
                      </span>
                    </label>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-3">
                    Amenities
                  </label>
                  <div className="space-y-2.5">
                    {[
                      { id: 'parking', label: 'Parking' },
                      { id: 'furnished', label: 'Furnished' },
                    ].map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          id={item.id}
                          className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400/40"
                          onChange={handleChange}
                          checked={sidebardata[item.id]}
                        />
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 transition">
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Sort By
                  </label>
                  <select
                    onChange={handleChange}
                    defaultValue="created_at_desc"
                    id="sort_order"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition appearance-none"
                  >
                    <option value="regularPrice_desc">Price: High to Low</option>
                    <option value="regularPrice_asc">Price: Low to High</option>
                    <option value="createdAt_desc">Latest</option>
                    <option value="createdAt_asc">Oldest</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-colors duration-200 text-sm tracking-wide"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-slate-800">
                Listing results
              </h1>
              {!loading && listings.length > 0 && (
                <span className="text-sm text-slate-500">
                  {listings.length} propert{listings.length === 1 ? 'y' : 'ies'}
                </span>
              )}
            </div>

            {loading && (
              <div className="flex items-center justify-center py-32">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-slate-300 border-t-amber-500 rounded-full animate-spin" />
                  <p className="text-sm text-slate-500">Loading listings...</p>
                </div>
              </div>
            )}

            {!loading && listings.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 py-24 text-center">
                <p className="text-slate-500 text-lg">No listings found</p>
                <p className="text-slate-400 text-sm mt-2">
                  Try adjusting your filters
                </p>
              </div>
            )}

            {!loading && listings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Listingitem key={listing._id} listing={listing} />
                ))}
              </div>
            )}

            {showMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={onShowMoreClick}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-amber-600 hover:text-amber-700 border border-amber-200 hover:border-amber-300 rounded-full bg-amber-50 hover:bg-amber-100 transition-all duration-200"
                >
                  Show more listings
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}