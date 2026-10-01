import React, { useState } from 'react';
import { 
    Search, MapPin, Zap, Droplets, PaintRoller, Wind, 
    CheckCircle2, Star, ShieldCheck, Clock, CreditCard, 
    HeadphonesIcon, ArrowRight 
} from 'lucide-react';
import { AboutUs, ProvidersInfo, Terms, Privacy, Contact } from './StaticPages';

interface LandingPageProps {
    onGetStarted: () => void;
}

const CATEGORIES = [
    { name: 'Electrician', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-500/10' },
    { name: 'Plumber', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/10' },
    { name: 'AC Repair', icon: Wind, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-500/10' },
    { name: 'Painter', icon: PaintRoller, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-500/10' },
    { name: 'Cleaner', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/10' },
    { name: 'More', icon: Search, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-500/10' }
];

const FEATURES = [
    { title: 'Verified Professionals', desc: 'Every provider is thoroughly vetted and background-checked.', icon: ShieldCheck },
    { title: 'Fast Booking', desc: 'Find and book a service within seconds, no waiting around.', icon: Clock },
    { title: 'Secure Payments', desc: 'Worry-free transactions and secure localized payments.', icon: CreditCard },
    { title: '24/7 Support', desc: 'Our team is always here to help you around the clock.', icon: HeadphonesIcon },
];

type Section = 'home' | 'about' | 'providers' | 'terms' | 'privacy' | 'contact';

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [currentSection, setCurrentSection] = useState<Section>('home');

    const renderContent = () => {
        switch (currentSection) {
            case 'about': return <AboutUs />;
            case 'providers': return <ProvidersInfo />;
            case 'terms': return <Terms />;
            case 'privacy': return <Privacy />;
            case 'contact': return <Contact />;
            default: return (
                <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-[80px]"></div>
                    <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs sm:text-sm font-semibold mb-6 animate-in slide-in-from-bottom-4 duration-500">
                        <Star className="w-4 h-4" /> Rated #1 for Local Services
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6 animate-in slide-in-from-bottom-6 duration-700 delay-100">
                        Book trusted local<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            services instantly.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 font-medium animate-in slide-in-from-bottom-8 duration-700 delay-200">
                        From expert electricians to professional cleaners, get the help you need precisely when you need it.
                    </p>

                    {/* Search Bar / Action Box */}
                    <div className="w-full max-w-3xl bg-white dark:bg-slate-800 p-2 sm:p-3 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row gap-2 sm:gap-0 animate-in zoom-in-95 duration-700 delay-300">
                        <div className="flex-1 flex items-center px-4 py-3 sm:py-0 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-700">
                            <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                            <input 
                                type="text" 
                                placeholder="Your address or zip code" 
                                className="w-full bg-transparent border-none outline-none px-3 text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                        </div>
                        <div className="flex-1 flex items-center px-4 py-3 sm:py-0">
                            <Search className="w-5 h-5 text-slate-400 shrink-0" />
                            <input 
                                type="text" 
                                placeholder="What do you need help with?" 
                                className="w-full bg-transparent border-none outline-none px-3 text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                        </div>
                        <button onClick={onGetStarted} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl sm:rounded-xl transition-colors shrink-0">
                            Search
                        </button>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500 animate-in fade-in duration-700 delay-500">
                        <p>Popular:</p>
                        {['House Cleaning', 'AC Repair', 'Plumbing', 'Electrician'].map((tag) => (
                            <span key={tag} className="hover:text-blue-600 cursor-pointer transition-colors underline decoration-slate-300 underline-offset-4">{tag}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">What are you looking for?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {CATEGORIES.map((cat, i) => {
                            const Icon = cat.icon;
                            return (
                                <button key={i} className="group flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                    <div className={`w-14 h-14 rounded-full ${cat.bg} ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="font-semibold text-slate-900 dark:text-white">{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>


            {/* How It Works Section */}
            <section className="py-24 bg-white dark:bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">How QuickServe Works</h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">Get your tasks done in three simple steps.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative text-center">
                        <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 z-0"></div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                                <Search className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-slate-800">1</div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Search Service</h3>
                            <p className="text-slate-500">Pick from our wide range of professional services.</p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                                <MapPin className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-slate-800">2</div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Choose Provider</h3>
                            <p className="text-slate-500">Compare reviews, prices, and proximity.</p>
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-slate-800">3</div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Get Work Done</h3>
                            <p className="text-slate-500">Enjoy seamless service and secure payment.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose QuickServe */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900 text-center">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-16">The QuickServe Promise</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FEATURES.map((feat, i) => {
                            const Icon = feat.icon;
                            return (
                                <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:-translate-y-2 transition-transform duration-300">
                                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feat.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Pre-footer CTA */}
            <section className="py-24 relative overflow-hidden bg-blue-600 dark:bg-blue-800">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-white rounded-full blur-[100px]"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-black rounded-full blur-[100px]"></div>
                </div>
                <div className="max-w-4xl mx-auto text-center px-4 relative z-10 flex flex-col items-center">
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">Ready to get things done?</h2>
                    <p className="text-blue-100 text-lg mb-10 max-w-2xl">Join thousands of users finding the best local professionals on QuickServe.</p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <button onClick={onGetStarted} className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-10 rounded-2xl shadow-xl transition-transform hover:-translate-y-1 text-lg">
                            Get Started
                        </button>
                        <button onClick={onGetStarted} className="bg-blue-700 dark:bg-blue-900 text-white hover:bg-blue-800 dark:hover:bg-slate-800 font-bold py-4 px-10 rounded-2xl transition-transform hover:-translate-y-1 border border-blue-500 dark:border-blue-700 text-lg">
                            Become a Provider
                        </button>
                    </div>
                </div>
            </section>
                </>
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-blue-500/30 flex flex-col">
            {/* Header / Nav */}
            <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentSection('home')}>
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/30">
                                Q
                            </div>
                            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">QuickServe</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-semibold">
                            <button onClick={onGetStarted} className="hidden sm:block text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Log in
                            </button>
                            <button onClick={onGetStarted} className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-5 py-2.5 rounded-full transition-all shadow-md shadow-slate-900/10 hover:shadow-lg dark:shadow-none hover:-translate-y-0.5">
                                Sign up
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="flex-grow">
                {renderContent()}
            </div>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-950 py-12 border-t border-slate-100 dark:border-slate-900 mt-auto">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentSection('home')}>
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold shadow-md">
                            Q
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">QuickServe</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-500">
                        <button onClick={() => setCurrentSection('about')} className="hover:text-blue-600 transition-colors">About Us</button>
                        <button onClick={() => setCurrentSection('providers')} className="hover:text-blue-600 transition-colors">Providers</button>
                        <button onClick={() => setCurrentSection('terms')} className="hover:text-blue-600 transition-colors">Terms</button>
                        <button onClick={() => setCurrentSection('privacy')} className="hover:text-blue-600 transition-colors">Privacy</button>
                        <button onClick={() => setCurrentSection('contact')} className="hover:text-blue-600 transition-colors">Contact</button>
                    </div>
                    <p className="text-slate-400 text-sm">© 2026 QuickServe. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
