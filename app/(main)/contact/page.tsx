"use client";
import React from "react";
import ContactForm from "./_components/ContactForm";
import MapComponent from "./_components/MapComponent";
import ContactInfo from "./_components/ContactInfo";
import HeroSection from "@/app/_components/HeroSection";

function ContactUs() {
  const locationURI =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.3061061095154!2d31.088588673507!3d-17.824279683139316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a7129b563ca1%3A0xc67234f6220e9214!2sCompulink%20Systems%20(Private)%20Limited!5e0!3m2!1sen!2szw!4v1733317735040!5m2!1sen!2szw";

  const handleFormSubmit = (data: any) => {
    console.log("Form Submitted: ", data);
    // Handle form submission logic here, such as sending the data to an API
  };

  return (
    <div className="w-full pt-0 bg-gray-100">
      <HeroSection />
      <div className="w-full mx-0 px-0">
        {" "}
        {/* Ensure no padding on the sides */}
        <div className="space-y-2">
          <div className="flex shadow-lg">
            {/* Contact Form */}
            <ContactForm onSubmit={handleFormSubmit} />
            {/* Contact Information */}
            <ContactInfo />
          </div>

          {/* Map */}
          <MapComponent locationURI={locationURI} />
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
