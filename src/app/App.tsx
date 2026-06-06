import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { TourPackages } from "./components/TourPackages";
import { TaxiService } from "./components/TaxiService";
import { AboutSection } from "./components/AboutSection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <TourPackages />
        <TaxiService />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
