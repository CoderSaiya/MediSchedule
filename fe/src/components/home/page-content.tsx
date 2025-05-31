import HeroSection from "@/components/home/hero-section"
import StatsSection from "@/components/home/stats-section"
import ServicesSection from "@/components/home/services-section"
import DoctorsSection from "@/components/home/doctors-section"
import TestimonialsSection from "@/components/home/testimonials-section"
import ContactSection from "@/components/home/contact-section"

export default function PageContent() {
    return (
        <div suppressHydrationWarning={true}>
            <HeroSection />
            <StatsSection />
            <ServicesSection />
            <DoctorsSection />
            <TestimonialsSection />
            <ContactSection />
        </div>
    );
}