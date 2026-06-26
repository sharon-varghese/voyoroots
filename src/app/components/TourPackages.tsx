import { useRef } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, Users, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { openWhatsAppChat } from "../config/whatsapp";

const tourPackages = [
  {
    id: 1,
    title: "Idukki Cardamom & Spices Explore",
    location: "Idukki, India",
    duration: "Customizable Day Plan",
    price: "à¤° 3000",
    rating: 4.9,
    reviews: 92,
    image: "/plantation/cardamom_idukki.jpeg",
    category: "Plantation",
    groupSize: "Individuals | Families | Groups",
  },
  {
    id: 2,
    title: "Kodaikanal Mountain Escape",
    location: "Kodaikanal, India",
    duration: "Customizable Day Plan",
    price: "र 6000",
    rating: 4.9,
    reviews: 234,
    image: "/kodai/kodai.jpeg",
    category: "Domestic",
    groupSize: "Individuals | Families | Groups",
  },
  {
    id: 3,
    title: "Munnar Tea & Nature Retreat",
    location: "Munnar, India",
    duration: "Customizable Day Plan",
    price: "र 5000",
    rating: 5.0,
    reviews: 189,
    image: "/munnar/munnar.jpeg",
    category: "Domestic",
    groupSize: "Individuals | Families | Groups",
  },
  {
    id: 4,
    title: "Chekuthanmala Farm Stay",
    location: "Chekuthanmala, India",
    duration: "Customizable Day Plan",
    price: "र 8000",
    rating: 4.8,
    reviews: 312,
    image: "/chekuthanmala/chekuthanmala.png",
    category: "Domestic",
    groupSize: "Individuals | Families | Groups",
  },
  {
    id: 5,
    title: "Vagamon Hill Station Getaway",
    location: "Vagamon, India",
    duration: "Customizable Day Plan",
    price: "र 7000",
    rating: 4.7,
    reviews: 156,
    image: "/vagamon/vagamon.jpeg",
    category: "Domestic",
    groupSize: "Individuals | Families | Groups",
  },
  {
    id: 6,
    title: "Velankanni Chruch & Beach Tour",
    location: "Velankanni, India",
    duration: "Customizable Day Plan",
    price: "र 15000",
    rating: 4.7,
    reviews: 67,
    image: "/velankanni/velankanni1.png",
    category: "Domestic",
    groupSize: "Individuals | Families | Groups",
  },
  
];

type TourSearch = {
  destination: string;
  date: string;
};

type TourPackagesProps = {
  search: TourSearch;
  onClearSearch: () => void;
};

export function TourPackages({ search, onClearSearch }: TourPackagesProps) {
  const packagesRef = useRef<HTMLDivElement>(null);
  const normalizedDestination = search.destination.trim().toLowerCase();
  const hasSearch = Boolean(normalizedDestination || search.date);
  const filteredPackages = normalizedDestination
    ? tourPackages.filter((tour) => {
        const searchableText = [
          tour.title,
          tour.location,
          tour.duration,
          tour.category,
          tour.groupSize,
        ].join(" ").toLowerCase();

        return searchableText.includes(normalizedDestination);
      })
    : tourPackages;

  const scrollPackages = (direction: "left" | "right") => {
    const container = packagesRef.current;

    if (!container) {
      return;
    }

    container.scrollBy({
      left: direction === "left" ? -container.clientWidth : container.clientWidth,
      behavior: "smooth",
    });
  };

  const handleBookTour = (tour: typeof tourPackages[0]) => {
    const message = `Hello! I'm interested in this tour package and would like to get a quote:\n\n📍 *${tour.title}*\n📌 Location: ${tour.location}\n⏱️ Duration: ${tour.duration}\n👥 Group Size: ${tour.groupSize}\n⭐ Rating: ${tour.rating}\n\nPlease provide more details, availability, and pricing.`;
    
    openWhatsAppChat(message);
  };

  return (
    <section id="tours" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[#f5ead7] text-[#8a5a13] hover:bg-[#f5ead7]">
            Tour Packages
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Popular Destinations
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our handpicked tour packages for unforgettable experiences across the globe
          </p>
          {hasSearch && (
            <div className="mt-6 flex flex-col items-center gap-3 text-sm text-gray-600 sm:flex-row sm:justify-center">
              <span>
                Showing results
                {search.destination && ` for "${search.destination}"`}
                {search.date && ` on ${search.date}`}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClearSearch}
              >
                Clear search
              </Button>
            </div>
          )}
        </div>

        {/* Tour Slider */}
        <div className="relative">
          {filteredPackages.length > 0 ? (
            <div
              ref={packagesRef}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {filteredPackages.map((tour) => (
                <Card
                  key={tour.id}
                  className="min-w-0 flex-[0_0_100%] overflow-hidden hover:shadow-xl transition-shadow duration-300 group snap-start md:flex-[0_0_calc(50%_-_0.75rem)] lg:flex-[0_0_calc(25%_-_1.125rem)]"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 right-4 bg-white text-gray-800">
                      {tour.category}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2">{tour.title}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{tour.location}</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{tour.groupSize}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{tour.rating}</span>
                        <span className="text-sm text-gray-500">({tour.reviews} reviews)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                      {/*
                      <button
                        type="button"
                        className="text-sm font-semibold text-[#06213d] underline-offset-4 hover:underline"
                        onClick={() => handleBookTour(tour)}
                      >
                        More details
                      </button>
                      */}
                      <Button
                        className="bg-[#06213d] hover:bg-[#0b3158]"
                        onClick={() => handleBookTour(tour)}
                      >
                        Get a Quote
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
              <h3 className="text-xl font-semibold text-[#06213d]">No matching tour packages</h3>
              <p className="mt-2 text-gray-600">
                Try a destination like Idukki, Munnar, Kodaikanal, Vagamon, Velankanni, or Chekuthanmala.
              </p>
              <Button
                type="button"
                className="mt-6 bg-[#06213d] hover:bg-[#0b3158]"
                onClick={onClearSearch}
              >
                View all packages
              </Button>
            </div>
          )}
        </div>

        {/* Slider Controls */}
        {filteredPackages.length > 4 && (
          <div className="mt-10 flex justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Scroll packages left"
              onClick={() => scrollPackages("left")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Scroll packages right"
              onClick={() => scrollPackages("right")}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
