import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    interest: 'General Information'
  });
  
  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  }>({
    submitted: false,
    success: false,
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormStatus({
      submitted: true,
      success: true,
      message: 'Thank you for your message! We will get back to you shortly.'
    });
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      interest: 'General Information'
    });
    
    setTimeout(() => {
      setFormStatus({
        submitted: false,
        success: false,
        message: ''
      });
    }, 5000);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | House of Grappling</title>
        <meta name="description" content="Get in touch with House of Grappling. Contact us for information about classes, memberships, or to schedule your free trial." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30" 
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/8989568/pexels-photo-8989568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        />
        <div className="absolute inset-0 bg-background opacity-90" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-text mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-text">
              Have questions? We're here to help. Get in touch with our team.
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative -mt-20 mb-16 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-background rounded-lg overflow-hidden shadow-xl">
            <div className="h-[400px] w-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48371.35847371849!2d-73.9959449!3d40.7306458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25af57b7175d3%3A0xc46c7d241b99d979!2sManhattan%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1625012345678!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="House of Grappling Location"
                className="w-full h-full"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
              <div className="flex items-start">
                <MapPin size={24} className="text-text mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-text mb-1">Location</h3>
                  <p className="text-text">
                    1234 Martial Arts Blvd<br />
                    Suite 100<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone size={24} className="text-text mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-text mb-1">Phone</h3>
                  <p className="text-text">
                    <a href="tel:+12125551234" className="hover:text-text transition-colors">
                      (212) 555-1234
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail size={24} className="text-text mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-text mb-1">Email</h3>
                  <p className="text-text">
                    <a href="mailto:info@houseofgrappling.com" className="hover:text-text transition-colors">
                      info@houseofgrappling.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock size={24} className="text-text mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-text mb-1">Hours</h3>
                  <p className="text-text">
                    Mon - Fri: 6:00 AM - 9:00 PM<br />
                    Sat: 8:00 AM - 5:00 PM<br />
                    Sun: 9:00 AM - 2:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-lg shadow-lg p-8 border border-neutral-200">
              <h2 className="text-2xl font-bold text-text mb-6">Get in Touch</h2>
              
              {formStatus.submitted && (
                <div className={`p-4 rounded-md mb-6 ${formStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {formStatus.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-text mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="interest" className="block text-sm font-medium text-text mb-1">
                      I'm Interested In *
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="General Information">General Information</option>
                      <option value="Free Trial Class">Free Trial Class</option>
                      <option value="Membership Options">Membership Options</option>
                      <option value="Private Training">Private Training</option>
                      <option value="Kids Program">Kids Program</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-text mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-background hover:bg-neutral-800 text-text font-bold py-3 px-6 rounded-md transition-colors inline-flex items-center justify-center"
                >
                  Send Message <Send size={16} className="ml-2" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-text mb-12 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Do I need any experience to start training?",
                answer: "Absolutely not! Most of our students start with zero experience. Our beginner-friendly classes are designed to introduce you to the fundamentals in a way that's accessible and non-intimidating."
              },
              {
                question: "What should I wear to my first class?",
                answer: "For your first class, comfortable athletic clothes like a t-shirt and shorts or sweatpants are perfect. If you decide to continue training, you'll eventually need a gi (the traditional uniform), but we offer gi rentals for beginners."
              },
              {
                question: "How often should I train as a beginner?",
                answer: "For beginners, we recommend training 2-3 times per week. This frequency allows you to make progress while giving your body enough time to recover between sessions."
              },
              {
                question: "Is Brazilian Jiu-Jitsu safe?",
                answer: "Safety is our top priority. While BJJ is a contact sport, our training methodology emphasizes controlled techniques and proper tapping out procedures. Our instructors create a safe training environment where injuries are rare."
              },
              {
                question: "What age can children start training?",
                answer: "Our kids' program accepts children as young as 5 years old. The curriculum is adapted to be age-appropriate, focusing on fundamental movements, discipline, and fun."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-text mb-2">{faq.question}</h3>
                <p className="text-text">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;