import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  MapPin, 
  Phone, 
  Mail, 
  Clock 
} from 'lucide-react';

const Footer: React.FC = () => {
  // Keeping useSiteSettings context to maintain theme capabilities
  useSiteSettings();

  return (
    <footer className="bg-background text-text pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/images/Logo hog 2 - 1.png" 
                alt="HOG Logo" 
                className="h-14 w-auto" 
              />
              <span className="text-sm text-text ml-2">House of Grappling</span>
            </div>
            <p className="text-text mb-4">
              House of Grappling provides world-class Brazilian Jiu-Jitsu training for all ages and skill levels. 
              Join our community and transform your life through martial arts.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-text hover:text-neutral-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-text hover:text-neutral-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-text hover:text-neutral-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Programs', path: '/programs' },
                { name: 'Schedule', path: '/schedule' },
                { name: 'Instructors', path: '/instructors' },
                { name: 'Shop', path: '/shop' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-text hover:text-neutral-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="text-text mt-1 mr-2" />
                <span className="text-text">
                  1234 Martial Arts Blvd<br />
                  Suite 100<br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-text mr-2" />
                <a href="tel:+12125551234" className="text-text hover:text-neutral-500 transition-colors">
                  (212) 555-1234
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-text mr-2" />
                <a href="mailto:info@houseofgrappling.com" className="text-text hover:text-neutral-500 transition-colors">
                  info@houseofgrappling.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hours</h3>
            <ul className="space-y-2">
              {[
                { day: 'Monday - Friday', hours: '6:00 AM - 9:00 PM' },
                { day: 'Saturday', hours: '8:00 AM - 5:00 PM' },
                { day: 'Sunday', hours: '9:00 AM - 2:00 PM' },
              ].map((schedule, index) => (
                <li key={index} className="flex items-start">
                  <Clock size={20} className="text-text mt-1 mr-2" />
                  <div>
                    <span className="text-text font-medium">{schedule.day}</span><br />
                    <span className="text-text">{schedule.hours}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-text text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} House of Grappling. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm text-text">
              <a href="#" className="hover:text-text transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-text transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;