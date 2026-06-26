import { Award, MapPinned, Users, Globe, Heart } from "lucide-react";

const stats = [
  {
    icon: Award,
    value: "15+",
    label: "Years Experience",
    color: "from-[#06213d] to-[#0b3158]",
  },
  {
    icon: Users,
    value: "50K+",
    label: "Happy Customers",
    color: "from-[#b77b1c] to-[#d39a34]",
  },
  {
    icon: Globe,
    value: "150+",
    label: "Curated Trips",
    color: "from-[#0b3158] to-[#06213d]",
  },
  {
    icon: Heart,
    value: "98%",
    label: "Satisfaction Rate",
    color: "from-pink-500 to-pink-600",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="/gallery/gallery4.jpeg"
                  alt="Travel"
                  className="rounded-2xl shadow-lg h-64 w-full object-cover"
                />
                <img
                  src="/gallery/gallery3.jpeg"
                  alt="Beach"
                  className="rounded-2xl shadow-lg h-48 w-full object-cover"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img
                  src="/gallery/gallery2.jpeg"
                  alt="City"
                  className="rounded-2xl shadow-lg h-48 w-full object-cover"
                />
                <img
                  src="/gallery/gallery1.png"
                  alt="Desert"
                  className="rounded-2xl shadow-lg h-64 w-full object-cover"
                />
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#06213d] to-[#b77b1c] rounded-full flex items-center justify-center">
                  <MapPinned className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="font-bold text-lg">Trusted Travel</div>
                  <div className="text-sm text-gray-600">Local Experts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Your Trusted Travel Partner
              <span className="block mt-2 bg-gradient-to-r from-[#06213d] to-[#b77b1c] bg-clip-text text-transparent">
                Since 2009
              </span>
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Voyoroots has been crafting unforgettable travel experiences for over a decade. From breathtaking tour packages to reliable taxi services, we're committed to making your journey seamless and memorable.
            </p>
            <p className="text-gray-600 text-lg mb-8">
              Our team of travel experts handpicks each destination and ensures every detail is perfect. Whether you're seeking adventure in the mountains or relaxation on pristine beaches, we've got the perfect package for you.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
