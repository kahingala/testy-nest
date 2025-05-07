package backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.model.Review;
import backend.repository.ReviewRepository;


@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
     @Autowired
    private ReviewRepository reviewRepository;

    @PostMapping
    public Review submitReview(@RequestBody Review review) {
        review.setSubmittedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    @GetMapping("/post/{postId}")
    public List<Review> getReviewsForPost(@PathVariable String postId) {
        return reviewRepository.findByPostId(postId);
    }
    
}
