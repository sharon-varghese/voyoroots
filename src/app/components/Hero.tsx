import { type FormEvent, useEffect, useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MOTTO } from "./BrandLogo";

const backgroundImages = [
  "/images/background.jpeg",
  "/images/backgroung2.jpeg",
  "/images/background3.jpeg",
  "/images/background4.jpeg",
];

const searchInputClass = "h-12 border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 [color-scheme:light]";

type HeroSearch = {
  destination: string;
  date: string;
};

type HeroProps = {
  onSearch: (search: HeroSearch) => void;
};

export function Hero({ onSearch }: HeroProps) {
  const [activeBackgroundIndex, setActiveBackgroundIndex] = useState(0);
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveBackgroundIndex((currentIndex) => (
        (currentIndex + 1) % backgroundImages.length
      ));
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSearch({
      destination: destination.trim(),
      date,
    });

    document.getElementById("tours")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Overlay */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt="Voyoroots travel background"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === activeBackgroundIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
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
        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Where to?"
                className={`pl-12 ${searchInputClass}`}
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
              />
            </div>
            <div className="relative">
              <Input
                type="date"
                placeholder="When?"
                className={searchInputClass}
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <Button type="submit" className="h-12 bg-[#b77b1c] hover:bg-[#9a6516]">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </form>

        {/* Service Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-[#d39a34]">Curated</div>
            <div className="text-gray-300 mt-2">Tour Packages</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white">Local</div>
            <div className="text-gray-300 mt-2">Travel Support</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-[#d39a34]">Taxi</div>
            <div className="text-gray-300 mt-2">Booking</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white">Custom</div>
            <div className="text-gray-300 mt-2">Trip Planning</div>
          </div>
        </div>
      </div>
    </section>
  );
}
