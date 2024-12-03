import { Button } from '@/components/ui/button'
import React from 'react'
import HeroSection from './_components/HeroSection'
import Header from './_components/Header'

function Home() {
  return (
    <div className=" text-gray-900">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className=" text-center">
          <h2 className="text-xl font-semibold mb-8">Our Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Odoo</h3>
              <p>Feature description goes here. Explain the unique value it provides.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Palladium</h3>
              <p>Feature description goes here. Explain the unique value it provides.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Excel</h3>
              <p>Feature description goes here. Explain the unique value it provides.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-blue-50">
        <div className=" text-center">
          <h2 className="text-xl font-semibold mb-4">About Fiscal Gem</h2>
          <p className=" mb-6">We help businesses streamline their fiscal device operations for seamless tax compliance.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className=" text-center">
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <p className=" mb-6">Have questions? Get in touch with our team.</p>

          <Button
            className='bg-green-500 hover:bg-green-900'
          >Email Us</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white text-sm text-center py-4">
        <p>&copy; 2024 Fiscal Gem. All Rights Reserved.</p>
      </footer>
    </div>
  )
}

export default Home