import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Star, X } from 'lucide-react';

interface CustomerReviewModalProps {
    booking: any;
    session: Session;
    onClose: () => void;
    onReviewSubmitted: (reviewData: any) => void;
}

const CustomerReviewModal: React.FC<CustomerReviewModalProps> = ({ booking, session, onClose, onReviewSubmitted }) => {
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (rating < 1 || rating > 5) {
            setError('Please select a star rating between 1 and 5.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const reviewData = {
                booking_id: booking.id,
                service_id: booking.service_id,
                customer_id: session.user.id,
                provider_id: booking.provider_id,
                rating,
                feedback
            };

            const { data, error: submitError } = await supabase
                .from('reviews')
                .insert([reviewData])
                .select()
                .single();

            if (submitError) throw submitError;

            onReviewSubmitted(data || reviewData);
        } catch (err: any) {
            console.error('Error submitting review:', err);
            setError(err.message || 'Failed to submit your review.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm sm:p-0">
            <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full transform transition-all animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Leave a Review</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">For {booking.services?.service_name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">How was the service provided by {booking.profiles?.full_name}?</p>
                            <div className="flex items-center justify-center gap-2" onMouseLeave={() => setHoverRating(0)}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                    >
                                        <Star 
                                            className={`w-10 h-10 ${
                                                star <= (hoverRating || rating) 
                                                    ? 'text-yellow-400 fill-yellow-400' 
                                                    : 'text-gray-300 dark:text-gray-600'
                                            }`} 
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Feedback (Optional)
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="feedback"
                                    name="feedback"
                                    rows={4}
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="block w-full rounded-2xl border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                                    placeholder="Tell us about your experience..."
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-4 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || rating === 0}
                                className="flex-1 flex justify-center items-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                ) : (
                                    'Submit Review'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerReviewModal;
