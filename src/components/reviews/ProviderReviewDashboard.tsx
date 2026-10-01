import React, { useEffect, useState } from 'react';
import ReviewList, { ReviewData } from './ReviewList';
import StarRating from './StarRating';
import { TrendingUp, MessageSquare } from 'lucide-react';

interface Stats {
    averageRating: number;
    totalReviews: number;
}

interface ProviderReviewDashboardProps {
    providerId: number;
}

const ProviderReviewDashboard: React.FC<ProviderReviewDashboardProps> = ({ providerId }) => {
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [stats, setStats] = useState<Stats>({ averageRating: 0, totalReviews: 0 });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // MOCKUP API CALLS
                // const statsRes = await fetch(`/api/reviews/average/${providerId}`);
                // const statsData = await statsRes.json();
                // const reviewsRes = await fetch(`/api/reviews/provider/${providerId}?size=10&page=0`);
                // const reviewsData = await reviewsRes.json();

                // Mocking Data for Demonstration
                setTimeout(() => {
                    setStats({
                        averageRating: 4.5,
                        totalReviews: 12
                    });
                    setReviews([
                        { id: 1, userId: 101, rating: 5, comment: "Excellent service! Very professional.", createdAt: new Date().toISOString() },
                        { id: 2, userId: 102, rating: 4, comment: "Good job, but arrived a bit late.", createdAt: new Date(Date.now() - 86400000).toISOString() }
                    ]);
                    setIsLoading(false);
                }, 1000);

            } catch (err: any) {
                setError(err.message || 'Failed to load reviews');
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [providerId]);

    return (
        <div className="max-w-4xl mx-auto py-8">
            {/* Dashboard Header / Setup */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Review Dashboard</h2>
                    <p className="text-blue-100">Analytics and feedback from your customers</p>
                </div>

                <div className="flex space-x-6 mt-6 md:mt-0">
                    <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center backdrop-blur-sm">
                        <div className="flex items-center space-x-2 text-2xl font-bold">
                            <span>{stats.averageRating.toFixed(1)}</span>
                            <TrendingUp className="w-5 h-5 text-yellow-300" />
                        </div>
                        <div className="text-sm text-blue-100 mt-1">Average Rating</div>
                        <div className="mt-2 scale-75 transform origin-top w-full flex justify-center">
                            <StarRating rating={stats.averageRating} readOnly />
                        </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center backdrop-blur-sm min-w[100px]">
                        <div className="flex items-center space-x-2 text-2xl font-bold">
                            <span>{stats.totalReviews}</span>
                            <MessageSquare className="w-5 h-5 text-blue-200" />
                        </div>
                        <div className="text-sm text-blue-100 mt-1">Total Reviews</div>
                    </div>
                </div>
            </div>

            {/* Reviews List Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Feedback</h3>
                    <select className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option>Most Recent</option>
                        <option>Highest Rating</option>
                        <option>Lowest Rating</option>
                    </select>
                </div>

                {error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                        {error}
                    </div>
                ) : (
                    <ReviewList reviews={reviews} isLoading={isLoading} />
                )}
            </div>
        </div>
    );
};

export default ProviderReviewDashboard;
