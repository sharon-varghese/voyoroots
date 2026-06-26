import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { TourPackages } from "./components/TourPackages";
import { TaxiService } from "./components/TaxiService";
import { AboutSection } from "./components/AboutSection";
import { Footer } from "./components/Footer";
import { useState } from "react";

export default function App() {
  const [tourSearch, setTourSearch] = useState({
    destination: "",
    date: "",
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero onSearch={setTourSearch} />
        <TourPackages search={tourSearch} onClearSearch={() => setTourSearch({ destination: "", date: "" })} />
        <TaxiService />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
