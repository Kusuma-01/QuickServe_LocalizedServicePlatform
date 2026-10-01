import React from 'react';
import StarRating from './StarRating';
import { UserCircle } from 'lucide-react';

export interface ReviewData {
    id: number;
    userId: number;
    userName?: string; // Opt-in if backend returns it
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewListProps {
    reviews: ReviewData[];
    isLoading: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, isLoading }) => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to leave one!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-200 hover:shadow-md"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                            <UserCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                    {review.userName || `User ${review.userId}`}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        <StarRating rating={review.rating} maxRating={5} readOnly />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                        {review.comment}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
