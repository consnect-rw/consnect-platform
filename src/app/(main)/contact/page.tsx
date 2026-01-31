"use client";

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Building2, Globe, Facebook, Linkedin, Twitter, Instagram, CheckCircle } from 'lucide-react';
import { ContactInfo } from '@/lib/data/contact-info';
import { toast } from 'sonner';
import { createSupportMessage } from '@/server/management/support-message';
import Link from 'next/link';


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createSupportMessage(formData);
      if (response) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        toast.success("Your message has been sent successfully!");
      } else {
        toast.error("Failed to send your message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting contact form: ", error);
      return toast.error("There was an error sending your message. Please try again later.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-y-1/2 translate-x-1/2"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Building2 className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white">{ContactInfo.companyName}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-white/90 text-lg sm:text-xl max-w-2xl mx-auto">
            {ContactInfo.tagline}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Address Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Visit Us</h3>
              <div className="space-y-2 text-gray-600">
                <p>{ContactInfo.headquarters.addressLine1}</p>
                <p>{ContactInfo.headquarters.addressLine2}</p>
                <p>{ContactInfo.headquarters.city}, {ContactInfo.headquarters.country}</p>
                <p className="text-sm text-gray-500 mt-3 italic">{ContactInfo.map.note}</p>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Phone</p>
                  <a href={`tel:${ContactInfo.contact.phone}`} className="text-amber-600 hover:text-amber-700 font-medium">
                    {ContactInfo.contact.phone}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">General Inquiries</p>
                  <a href={`mailto:${ContactInfo.contact.email}`} className="text-amber-600 hover:text-amber-700 font-medium break-all">
                    {ContactInfo.contact.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Support</p>
                  <a href={`mailto:${ContactInfo.support.customerSupportEmail}`} className="text-amber-600 hover:text-amber-700 font-medium break-all">
                    {ContactInfo.support.customerSupportEmail}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Sales</p>
                  <a href={`mailto:${ContactInfo.support.salesEmail}`} className="text-amber-600 hover:text-amber-700 font-medium break-all">
                    {ContactInfo.support.salesEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* Office Hours Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Office Hours</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900">{ContactInfo.officeHours.weekdays}</p>
                  <p className="text-gray-600">{ContactInfo.officeHours.hours}</p>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">{ContactInfo.officeHours.weekends}</p>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-amber-600 font-medium">
                    ⏱️ {ContactInfo.support.responseTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <Link href={ContactInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-xl flex items-center justify-center transition-all">
                  <Facebook className="w-5 h-5 text-blue-600" />
                </Link>
                <Link href={ContactInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-xl flex items-center justify-center transition-all">
                  <Linkedin className="w-5 h-5 text-blue-700" />
                </Link>
                <Link href={ContactInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-sky-100 hover:bg-sky-200 rounded-xl flex items-center justify-center transition-all">
                  <Twitter className="w-5 h-5 text-sky-500" />
                </Link>
                <Link href={ContactInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-pink-100 hover:bg-pink-200 rounded-xl flex items-center justify-center transition-all">
                  <Instagram className="w-5 h-5 text-pink-600" />
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-700 text-sm font-medium">Thank you! Your message has been sent successfully.</p>
                </div>
              )}

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                    placeholder="Your full name"
                    required
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                      placeholder="+250 XXX XXX XXX"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <select
                   aria-label='subject'
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales & Partnership</option>
                    <option value="tender">Tender Related</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <iframe
                title='Company Location'
                src={ContactInfo.map.embedUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
            </div>

            {/* Service Regions */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">We Serve Across Rwanda</h3>
              <div className="flex flex-wrap gap-2">
                {ContactInfo.additionalInfo.servicesRegions.map((region, index) => (
                  <span key={index} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium">
                    {region}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">{ContactInfo.additionalInfo.companyRegistration}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}