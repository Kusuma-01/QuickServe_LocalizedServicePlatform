import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export const AboutUs = () => (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-slate-800 dark:text-slate-200">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-8">About QuickServe</h1>
        <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">
            <p className="mb-6">
                QuickServe was founded with a simple mission: to connect people with reliable, top-quality local service professionals quickly and securely.
                Whether you need a plumber, an electrician, a house cleaner, or a handyman, we make finding the right person for the job effortless.
            </p>
            <p className="mb-6">
                Our platform uses advanced algorithms to match you with top-rated providers in your area, ensuring that every service request is handled with the utmost care and professionalism. We believe that booking local services should be as easy as sending a text message.
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-900 dark:text-white">Our Values</h2>
            <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" /> <span><strong>Trust & Safety:</strong> Every provider undergoes a strict background check and verification process.</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" /> <span><strong>Transparency:</strong> Clear pricing, genuine reviews, and no hidden fees.</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" /> <span><strong>Quality:</strong> We maintain high standards, and providers are continuously evaluated based on user feedback.</span></li>
            </ul>
        </div>
    </div>
);

export const ProvidersInfo = () => (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-slate-800 dark:text-slate-200">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6">For Providers</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">Grow your business and reach more customers with QuickServe.</p>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Why partner with us?</h2>
            <div className="space-y-6 text-lg">
                <p><strong>✓ Flexible Schedule:</strong> Work when you want, where you want. You are your own boss.</p>
                <p><strong>✓ Guaranteed Payments:</strong> No more chasing down invoices. Secure, automated payments directly to your account.</p>
                <p><strong>✓ Build Your Reputation:</strong> Collect reviews and showcase your expertise to thousands of potential customers in your area.</p>
                <p><strong>✓ Support 24/7:</strong> Our dedicated provider support team is always here to help you succeed.</p>
            </div>
            <div className="mt-10 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-2">Ready to join?</h3>
                <p className="text-blue-800 dark:text-blue-400 mb-4">Sign up today and start receiving service requests right away.</p>
            </div>
        </div>
    </div>
);

export const Terms = () => (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-slate-800 dark:text-slate-200">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-8">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none space-y-6">
            <p>Last updated: March 2026</p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p>By accessing or using QuickServe, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.</p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">2. User Accounts</h2>
            <p>You must create an account to use certain features. You are responsible for safeguarding your password and for all activities that occur under your account.</p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">3. Services and Payments</h2>
            <p>QuickServe connects customers with service providers. We act as an intermediary for transactions. Payments are processed securely via our payment partners.</p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">4. Prohibited Conduct</h2>
            <p>You agree not to engage in any unlawful activities, submit false information, or harass other users or providers.</p>
        </div>
    </div>
);

export const Privacy = () => (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-slate-800 dark:text-slate-200">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-8">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none space-y-6">
            <p>Your privacy is important to us. This policy explains how we collect, use, and protect your information.</p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Information We Collect</h2>
            <p>We collect information you provide directly to us, such as your name, email, phone number, address, and payment details when you register or book a service.</p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How We Use Your Information</h2>
            <p>We use the information to connect you with providers, process your payments, provide customer support, and improve our services.</p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure.</p>
        </div>
    </div>
);

export const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const text = encodeURIComponent(`*New Contact Message*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n\n*Message:*\n${formData.message}`);

        window.open(`https://wa.me/919398238688?text=${text}`, '_blank');
    };

    return (
        <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-slate-800 dark:text-slate-200">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-8">Contact Us</h1>
            <p className="text-lg mb-10">Have questions or need help? Our support team is available 24/7.</p>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Get in Touch</h2>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">Email</p>
                                <p className="text-slate-500">support@quickserve.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">Phone</p>
                                <p className="text-slate-500">+1 (800) 123-4567</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">Office</p>
                                <p className="text-slate-500">123 Service Blvd, San Francisco, CA</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send a Message</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                            <textarea
                                rows={4}
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
                                placeholder="How can we help?"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-2"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
