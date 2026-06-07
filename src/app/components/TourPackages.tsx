import { MapPin, Clock, Users, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { openWhatsAppChat } from "../config/whatsapp";

const tourPackages = [
  {
    id: 1,
    title: "Mountain Adventure",
    location: "Swiss Alps, Switzerland",
    duration: "7 Days / 6 Nights",
    price: "$1,299",
    rating: 4.9,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1673505413397-0cd0dc4f5854?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMGFkdmVudHVyZSUyMHRyYXZlbHxlbnwxfHx8fDE3NzY0MTU4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "International",
    groupSize: "2-8 people",
  },
  {
    id: 2,
    title: "Tropical Paradise",
    location: "Maldives Islands",
    duration: "5 Days / 4 Nights",
    price: "$1,899",
    rating: 5.0,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1714412192114-61dca8f15f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2UlMjB2YWNhdGlvbnxlbnwxfHx8fDE3NzYzMzUyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "International",
    groupSize: "2-6 people",
  },
  {
    id: 3,
    title: "City Explorer",
    location: "Dubai, UAE",
    duration: "4 Days / 3 Nights",
    price: "$899",
    rating: 4.8,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1760502431557-2976b538959b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjaXR5JTIwc2t5bGluZSUyMHVyYmFufGVufDF8fHx8MTc3NjQxNTg0OHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "International",
    groupSize: "2-10 people",
  },
  {
    id: 4,
    title: "Desert Safari",
    location: "Rajasthan, India",
    duration: "3 Days / 2 Nights",
    price: "$399",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1554369369-2efa1c2be9d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBzYWZhcmklMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzc2MzUwMjk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Domestic",
    groupSize: "4-12 people",
  },
];

export function TourPackages() {
  const handleBookTour = (tour: typeof tourPackages[0]) => {
    const message = `Hello! I'm interested in booking the following tour package:\n\n📍 *${tour.title}*\n📌 Location: ${tour.location}\n⏱️ Duration: ${tour.duration}\n👥 Group Size: ${tour.groupSize}\n💰 Price: ${tour.price}\n⭐ Rating: ${tour.rating}\n\nPlease provide more details and availability.`;
    
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
        </div>

        {/* Tour Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tourPackages.map((tour) => (
            <Card
              key={tour.id}
              className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
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

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-sm text-gray-500">Starting from</span>
                    <div className="text-2xl font-bold text-[#06213d]">{tour.price}</div>
                  </div>
                  <Button 
                    className="bg-[#06213d] hover:bg-[#0b3158]"
                    onClick={() => handleBookTour(tour)}
                  >
                    Book
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" className="px-8">
            View All Packages
          </Button>
        </div>
      </div>
    </section>
  );
}
