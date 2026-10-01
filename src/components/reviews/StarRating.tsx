import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    onRatingChange?: (rating: number) => void;
    readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxRating = 5,
    onRatingChange,
    readOnly = false,
}) => {
    const [hoverRating, setHoverRating] = React.useState<number>(0);

    const handleMouseEnter = (index: number) => {
        if (!readOnly) setHoverRating(index);
    };

    const handleMouseLeave = () => {
        if (!readOnly) setHoverRating(0);
    };

    const handleClick = (index: number) => {
        if (!readOnly && onRatingChange) {
            onRatingChange(index);
        }
    };

    return (
        <div className="flex items-center space-x-1">
            {[...Array(maxRating)].map((_, index) => {
                const starValue = index + 1;
                const isActive = starValue <= (hoverRating || rating);

                return (
                    <Star
                        key={index}
                        className={`w-6 h-6 transition-colors duration-200 ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                            } ${isActive
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                        onMouseEnter={() => handleMouseEnter(starValue)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(starValue)}
                    />
                );
            })}
            {readOnly && (
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {rating.toFixed(1)} / {maxRating}
                </span>
            )}
        </div>
    );
};

export default StarRating;
