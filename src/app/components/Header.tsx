import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { openWhatsAppChat } from "../config/whatsapp";
import { BrandLogo } from "./BrandLogo";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBookNow = () => {
    const message = `Hello! I'm interested in your travel services and would like to make a booking. Please provide more information.`;
    openWhatsAppChat(message);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" aria-label="Voyoroots home" className="-ml-4 sm:-ml-6">
            <BrandLogo markClassName="h-14 w-72 sm:h-16 sm:w-96" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-700 hover:text-[#06213d] transition-colors">
              Home
            </a>
            <a href="#tours" className="text-gray-700 hover:text-[#06213d] transition-colors">
              Tours
            </a>
            <a href="#taxi" className="text-gray-700 hover:text-[#06213d] transition-colors">
              Taxi Service
            </a>
            <a href="#about" className="text-gray-700 hover:text-[#06213d] transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-[#06213d] transition-colors">
              Contact
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              className="bg-[#06213d] hover:bg-[#0b3158]"
              onClick={handleBookNow}
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <a
                href="#home"
                className="text-gray-700 hover:text-[#06213d] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#tours"
                className="text-gray-700 hover:text-[#06213d] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Tours
              </a>
              <a
                href="#taxi"
                className="text-gray-700 hover:text-[#06213d] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Taxi Service
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-[#06213d] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-[#06213d] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <Button className="bg-[#06213d] hover:bg-[#0b3158] mt-2" onClick={handleBookNow}>
                Book Now
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
