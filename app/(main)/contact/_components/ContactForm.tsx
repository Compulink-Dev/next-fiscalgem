import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

function ContactForm({
  title = "Contact Us Today",
  description = "We'd love to hear from you!",
  onSubmit,
}: any) {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    onSubmit && onSubmit(data); // Pass the form data to the parent handler
  };

  return (
    <div className="bg-white p-12 w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        {title}
      </h2>
      <p className="text-gray-600 mb-6 text-center">{description}</p>
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        <div className="flex gap-4 w-full">
          <div className="w-full">
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              className="mt-1  w-full border border-gray-300 focus:ring-2 focus:ring-green-500"
              placeholder="Your full name"
              required
            />
          </div>
          <div className="w-full">
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              className="mt-1 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Your email address"
              required
            />
          </div>
        </div>
        <div>
          <Label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Message
          </Label>
          <Textarea
            id="message"
            name="message"
            rows={4}
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="Write your message here..."
            required
          ></Textarea>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-green-900 hover:bg-green-700 text-white w-full"
          >
            Send Message
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
