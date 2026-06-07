import { Search, MapPin, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MOTTO } from "./BrandLogo";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1673505413397-0cd0dc4f5854?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMGFkdmVudHVyZSUyMHRyYXZlbHxlbnwxfHx8fDE3NzY0MTU4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Mountain landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06213d]/80 via-[#06213d]/45 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-32">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
          <img
            src="/images/font.png"
            alt="Voyoroots"
            className="mx-auto h-16 w-auto sm:h-20 md:h-24 lg:h-28"
          />
          <span className="block mt-2 text-[#d39a34]">
            Travel Stories Begin Here
          </span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-200">
          {MOTTO}
        </p>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Where to?"
                className="pl-12 h-12 border-gray-300 bg-gray-50"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="date"
                placeholder="When?"
                className="pl-12 h-12 border-gray-300 bg-gray-50"
              />
            </div>
            <Button className="h-12 bg-[#b77b1c] hover:bg-[#9a6516]">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-[#d39a34]">500+</div>
            <div className="text-gray-300 mt-2">Destinations</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white">10K+</div>
            <div className="text-gray-300 mt-2">Happy Travelers</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-[#d39a34]">24/7</div>
            <div className="text-gray-300 mt-2">Taxi Service</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white">100%</div>
            <div className="text-gray-300 mt-2">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
}
