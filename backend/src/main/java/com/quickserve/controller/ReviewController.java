package com.quickserve.controller;

import com.quickserve.dto.ReviewDTO;
import com.quickserve.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Update with specific frontend URL in production
public class ReviewController {

    private final ReviewService reviewService;

    // POST /api/reviews
    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@RequestBody ReviewDTO reviewDTO) {
        // In real app, extract user ID from JWT Security Context
        ReviewDTO createdReview = reviewService.createReview(reviewDTO);
        return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
    }

    // GET /api/reviews/provider/{providerId}
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<Page<ReviewDTO>> getProviderReviews(
            @PathVariable Long providerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Page<ReviewDTO> reviews = reviewService.getReviewsByProvider(providerId, page, size, sortBy, direction);
        return ResponseEntity.ok(reviews);
    }

    // GET /api/reviews/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ReviewDTO>> getUserReviews(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Page<ReviewDTO> reviews = reviewService.getReviewsByUser(userId, page, size, sortBy, direction);
        return ResponseEntity.ok(reviews);
    }

    // PUT /api/reviews/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ReviewDTO> updateReview(
            @PathVariable Long id,
            @RequestBody ReviewDTO reviewDTO,
            @RequestParam Long currentUserId) { // currentUserId would normally come from JWT token
        ReviewDTO updatedReview = reviewService.updateReview(id, reviewDTO, currentUserId);
        return ResponseEntity.ok(updatedReview);
    }

    // DELETE /api/reviews/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            @RequestParam Long currentUserId) { // currentUserId would normally come from JWT token
        reviewService.deleteReview(id, currentUserId);
        return ResponseEntity.noContent().build();
    }

    // GET /api/reviews/average/{providerId}
    @GetMapping("/average/{providerId}")
    public ResponseEntity<Map<String, Object>> getProviderAverageRating(@PathVariable Long providerId) {
        Map<String, Object> stats = reviewService.getProviderAverageRating(providerId);
        return ResponseEntity.ok(stats);
    }
}
