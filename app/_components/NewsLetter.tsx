import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react'

function NewsletterSection() {
    return (
        <section id="newsletter" className="py-16 bg-green-800 text-white">
            <div className="max-w-5xl mx-auto px-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
                <p className="font-light mb-6">
                    Subscribe to our newsletter for updates, tips, and offers.
                </p>
                <form className="flex flex-col sm:flex-row justify-center gap-4">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full sm:w-auto flex-grow text-gray-900 outline-none "
                    />
                    <Button
                        type="submit"
                        className="bg-green-500 hover:bg-green-900  transition-transform transform hover:scale-105"
                    >
                        Subscribe
                    </Button>
                </form>
            </div>
        </section>
    );
}

export default NewsletterSection;
