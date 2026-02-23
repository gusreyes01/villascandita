import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import Amenities from "@/components/Amenities";
import Rooms from "@/components/Rooms";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import BookingWidget from "@/components/BookingWidget";
import Location from "@/components/Location";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <AboutSection />
      <Amenities />
      <Rooms />
      <Gallery />
      <Testimonials />
      <BookingWidget />
      <Location />
      <Footer />
    </main>
  );
}
