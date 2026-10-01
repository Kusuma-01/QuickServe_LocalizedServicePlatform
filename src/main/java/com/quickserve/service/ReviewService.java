package com.quickserve.service;

import com.quickserve.dto.ReviewDTO;
import com.quickserve.exception.BadRequestException;
import com.quickserve.exception.ResourceNotFoundException;
import com.quickserve.model.Review;
import com.quickserve.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    // In a real scenario, we'll inject BookingRepository to verify booking status
    // private final BookingRepository bookingRepository;

    @Transactional
    public ReviewDTO createReview(ReviewDTO reviewDTO) {
        // Validation: Rating between 1 and 5
        if (reviewDTO.getRating() < 1 || reviewDTO.getRating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        // Validation: Empty feedback
        if (reviewDTO.getComment() == null || reviewDTO.getComment().trim().isEmpty()) {
            throw new BadRequestException("Feedback cannot be empty");
        }

        // Validation: One booking = One review
        if (reviewRepository.existsByBookingId(reviewDTO.getBookingId())) {
            throw new BadRequestException("A review for this booking already exists");
        }

        // TODO: Validate booking status is COMPLETED using BookingRepository
        // Booking booking =
        // bookingRepository.findById(reviewDTO.getBookingId()).orElseThrow(...);
        // if (!booking.getStatus().equals("COMPLETED")) throw ...

        Review review = Review.builder()
                .bookingId(reviewDTO.getBookingId())
                .userId(reviewDTO.getUserId())
                .providerId(reviewDTO.getProviderId())
                .rating(reviewDTO.getRating())
                .comment(reviewDTO.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);
        return mapToDTO(savedReview);
    }

    public Page<ReviewDTO> getReviewsByProvider(Long providerId, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Review> reviews = reviewRepository.findByProviderId(providerId, pageable);
        return reviews.map(this::mapToDTO);
    }

    public Page<ReviewDTO> getReviewsByUser(Long userId, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Review> reviews = reviewRepository.findByUserId(userId, pageable);
        return reviews.map(this::mapToDTO);
    }

    @Transactional
    public ReviewDTO updateReview(Long id, ReviewDTO reviewDTO, Long currentUserId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found for this id :: " + id));

        // Authorization check: Only owner can edit
        if (!review.getUserId().equals(currentUserId)) {
            throw new BadRequestException("You don't have permission to edit this review");
        }

        if (reviewDTO.getRating() < 1 || reviewDTO.getRating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }
        if (reviewDTO.getComment() == null || reviewDTO.getComment().trim().isEmpty()) {
            throw new BadRequestException("Feedback cannot be empty");
        }

        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());

        Review updatedReview = reviewRepository.save(review);
        return mapToDTO(updatedReview);
    }

    @Transactional
    public void deleteReview(Long id, Long currentUserId) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found for this id :: " + id));

        // Authorization check: Only owner (or Admin via another endpoint) can delete
        if (!review.getUserId().equals(currentUserId)) {
            throw new BadRequestException("You don't have permission to delete this review");
        }

        reviewRepository.delete(review);
    }

    public Map<String, Object> getProviderAverageRating(Long providerId) {
        Double averageRating = reviewRepository.getAverageRatingForProvider(providerId);
        Long totalReviews = reviewRepository.countReviewsForProvider(providerId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("averageRating", averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0);
        stats.put("totalReviews", totalReviews);
        return stats;
    }

    private ReviewDTO mapToDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .bookingId(review.getBookingId())
                .userId(review.getUserId())
                .providerId(review.getProviderId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
