import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Star, MessageSquare } from 'lucide-react';

interface ProviderReviewsProps {
    session: Session;
}

const ProviderReviews: React.FC<ProviderReviewsProps> = ({ session }) => {
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState<any[]>([]);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        fetchReviews();
    }, [session.user.id]);

    const fetchReviews = async () => {
        try {
            setLoading(true);

            // Fetch reviews
            const { data: reviewsData, error: reviewsError } = await supabase
                .from('reviews')
                .select('*')
                .eq('provider_id', session.user.id)
                .order('created_at', { ascending: false });

            if (reviewsError) throw reviewsError;

            if (reviewsData && reviewsData.length > 0) {
                // Fetch service details
                const serviceIds = [...new Set(reviewsData.map(r => r.service_id))];
                const { data: servicesData } = await supabase
                    .from('services')
                    .select('id, service_name')
                    .in('id', serviceIds);

                const servicesMap = (servicesData || []).reduce((acc: any, service: any) => {
                    acc[service.id] = service;
                    return acc;
                }, {});

                // Fetch customer profiles
                const customerIds = [...new Set(reviewsData.map(r => r.customer_id))];
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, full_name, avatar_url')
                    .in('id', customerIds);

                const profilesMap = (profilesData || []).reduce((acc: any, profile: any) => {
                    acc[profile.id] = profile;
                    return acc;
                }, {});

                let totalRating = 0;
                const enrichedReviews = reviewsData.map((review) => {
                    totalRating += review.rating;
                    return {
                        ...review,
                        service: servicesMap[review.service_id],
                        customer: profilesMap[review.customer_id]
                    };
                });

                setReviews(enrichedReviews);
                setAverageRating(Number((totalRating / enrichedReviews.length).toFixed(1)));
            } else {
                setReviews([]);
                setAverageRating(0);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto w-full h-full overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Customer Reviews</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">See what your customers are saying about your work.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-10">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex-1 min-w-[250px] flex items-center gap-6">
                    <div className="w-20 h-20 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center shrink-0">
                        <Star className="w-10 h-10 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Average Rating</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                            {averageRating}
                            <span className="text-lg text-gray-400 font-medium">/ 5.0</span>
                        </h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex-1 min-w-[250px] flex items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center shrink-0">
                        <MessageSquare className="w-10 h-10 text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Total Reviews</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white">
                            {reviews.length}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Star className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Reviews Yet</h3>
                        <p className="text-gray-500 font-medium max-w-sm mx-auto">Complete more bookings and encourage customers to leave a review.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all text-left">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xl rounded-2xl flex items-center justify-center shadow-sm">
                                            {review.customer?.full_name?.charAt(0) || 'C'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                                                {review.customer?.full_name || 'Customer'}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                                key={star} 
                                                className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} 
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
                                    <p className="text-gray-700 dark:text-gray-300 italic">
                                        "{review.feedback || 'No written feedback provided.'}"
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    For: <span className="font-bold text-gray-700 dark:text-gray-300">{review.service?.service_name || 'Service'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderReviews;
