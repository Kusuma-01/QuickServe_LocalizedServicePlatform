import React, { useState } from 'react';
import StarRating from './StarRating';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ReviewFormProps {
    bookingId: number;
    providerId: number;
    onSubmitSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ bookingId, providerId, onSubmitSuccess }) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        if (comment.trim().length === 0) {
            setError('Please provide feedback.');
            return;
        }
        if (comment.trim().length > 500) {
            setError('Feedback must be less than 500 characters.');
            return;
        }

        setIsSubmitting(true);

        // API Call Mockup - Replace with actual fetch
        try {
            const payload = {
                bookingId,
                providerId,
                userId: 1, // Mock user ID
                rating,
                comment: comment.trim()
            };

            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                throw new Error(errData?.message || 'Failed to submit review');
            }

            setSuccess(true);
            setRating(0);
            setComment('');
            if (onSubmitSuccess) onSubmitSuccess();
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3 shadow-sm border border-green-100 dark:border-green-900">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Review Submitted!</h3>
                <p className="text-sm text-green-600 dark:text-green-400">Thank you for your feedback.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-sm font-medium text-green-700 hover:text-green-800 underline dark:text-green-400"
                >
                    Submit another
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Rate this Service</h3>

                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-start text-sm">
                        <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center space-y-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Rating</label>
                        <StarRating rating={rating} onRatingChange={setRating} />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Share details of your experience
                        </label>
                        <div className="relative">
                            <textarea
                                id="comment"
                                rows={4}
                                maxLength={500}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pl-4 pt-3 pb-8 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none transition-all duration-200"
                                placeholder="What did you like or dislike? How was the service quality?"
                            />
                            <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                                {500 - comment.length} characters left
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || rating === 0 || comment.length === 0}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-medium text-white transition-all duration-200
              ${isSubmitting || rating === 0 || comment.length === 0
                                ? 'bg-blue-300 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Review'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewForm;
