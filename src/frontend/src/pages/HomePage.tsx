import Footer from "../components/Footer";
import Header from "../components/Header";
import AboutSection from "../components/sections/AboutSection";
import ActivitiesSection from "../components/sections/ActivitiesSection";
import ContactSection from "../components/sections/ContactSection";
import DonationSection from "../components/sections/DonationSection";
import EmergencySection from "../components/sections/EmergencySection";
import GallerySection from "../components/sections/GallerySection";
import HeroSection from "../components/sections/HeroSection";
import ImpactSection from "../components/sections/ImpactSection";
import TeamSection from "../components/sections/TeamSection";
import VolunteerSection from "../components/sections/VolunteerSection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ActivitiesSection />
        <ImpactSection />
        <TeamSection />
        <GallerySection />
        <DonationSection />
        <VolunteerSection />
        <EmergencySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
