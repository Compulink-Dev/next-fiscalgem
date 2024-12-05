import React from 'react'
import HeroSection from '../_components/HeroSection'
import FeaturesSection from '../_components/FeaturesSection'
import BenefitsSection from '../_components/BenefitSection'
import TestimonialSection from '../_components/TestimonialSection'
import AboutSection from '../_components/AboutSection'
import PartnerSection from '../_components/PartnerSection'
import NewsletterSection from '../_components/NewsLetter'

function Home() {
  return (
    <div className=" text-gray-900">


      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* About Section */}
      <BenefitsSection />
      <TestimonialSection />
      <AboutSection />
      <PartnerSection />
      <NewsletterSection />

    </div>
  )
}

export default Home