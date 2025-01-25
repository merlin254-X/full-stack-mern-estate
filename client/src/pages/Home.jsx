import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import 'swiper/css/bundle';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ListingItem from "../component/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Fetch offer listings
        const offerRes = await fetch('/api/listing/get?offer=true&limit=4');
        const offerData = await offerRes.json();
        setOfferListings(offerData);

        // Fetch rent listings
        const rentRes = await fetch('/api/listing/get?type=rent&limit=4');
        const rentData = await rentRes.json();
        setRentListings(rentData);

        // Fetch sale listings
        const saleRes = await fetch('/api/listing/get?type=sale&limit=4');
        const saleData = await saleRes.json();
        setSaleListings(saleData);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      }
    };

    fetchListings();
  }, []);

  // Helper function to render Swiper slides
  const renderSwiperSlides = (listings) => {
    return listings.map((listing) => (
      <SwiperSlide key={listing._id}>
        <div
          style={{
            background: `url(${listing.imageUrls[0]}) center no-repeat`,
            backgroundSize: "cover",
          }}
          className="h-[500px]"
        ></div>
      </SwiperSlide>
    ));
  };

  // Helper function to render listing sections
  const renderListingSection = (title, listings, queryParam) => {
    return (
      listings.length > 0 && (
        <div className="my-3">
          <h2 className="text-2xl font-semibold text-slate-600">{title}</h2>
          <Link className="text-sm text-blue-800 hover:underline" to={`/search?${queryParam}`}>
            Show more
          </Link>
          <div className="flex flex-wrap gap-4">
            {listings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        </div>
      )
    );
  };

  return (
    <div>
      {/* Top Section */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font3xl lg:text-6xl">
          Discover your dream <span className="text-slate-500">home</span>
          <br />
          effortlessly
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
        LuxeLiving-Estates, we help you find the ideal property to call home.
          <br />
          Explore our diverse selection of listings tailored to your needs.
        </div>
        <Link to={"/search"} className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">
          Begin your journey...
        </Link>
      </div>
      {/* Swiper Section */}
      <Swiper navigation>
        {offerListings.length > 0 && renderSwiperSlides(offerListings)}
      </Swiper>

      {/* Listing Results for Sale and Rent */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {renderListingSection("Recent offers", offerListings, "offer=true")}
        {renderListingSection("Recent places for rent", rentListings, "type=rent")}
        {renderListingSection("Recent places for sale", saleListings, "type=sale")}
      </div>
    </div>
  );
}