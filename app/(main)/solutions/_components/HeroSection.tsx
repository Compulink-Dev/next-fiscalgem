// components/HeroSection.js
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HeroSection = () => {
    return (
        <section className="relative bg-cover bg-center py-32 text-center text-white" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <h1 className="text-5xl font-bold mb-4 text-gradient">Empower Your Business with Smart Solutions</h1>
                <p className="text-xl mb-8 leading-relaxed">Discover how our tools can streamline your operations and improve your bottom line with seamless integration and expert support.</p>
                <Link href="/contact">
                    <Button className="bg-green-600 hover:bg-green-900 transition-all transform hover:scale-105">
                        Get Started
                    </Button>
                </Link>
            </div>
        </section>
    );
}

export default HeroSection;
