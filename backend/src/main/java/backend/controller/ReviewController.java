package backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import backend.exception.LearningProgressNotFoundException;
import backend.model.Review;
import backend.repository.ReviewRepository;


@RestController

@CrossOrigin("http://localhost:3000")
public class ReviewController {
   @Autowired
   private ReviewRepository reviewRepository;

    @GetMapping("/api/reviews")
    List<Review> getAll() {
        return reviewRepository.findAll();
    }
    @GetMapping("/api/reviews/{id}")
   Review getById(@PathVariable String id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new LearningProgressNotFoundException(id));
    }


   /*  @GetMapping("/posts/{postId}")
    public ResponseEntity<List<Review>> getReviewsByPostId(@PathVariable String postId) {
        return ResponseEntity.ok(reviewService.getReviewsByPostId(postId));
    }*/

   /* @GetMapping("/users/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUserId(userId));
    }*/

    @PostMapping("/api/reviews")
    public Review nReview(@RequestBody Review nReview) {
        return reviewRepository.save(nReview);
    }

    @PutMapping("/api/reviews/{id}")
    Review update(@RequestBody Review nReview, @PathVariable String id) {
        return reviewRepository.findById(id)
                .map(reviewm -> {
                    reviewm.setComment(nReview.getComment());
                    reviewm.setId(nReview.getId());
                    reviewm.setPostId(nReview.getPostId());
                    reviewm.setUserId(nReview.getUserId());
                    reviewm.setUserName(nReview.getUserName());
                    reviewm.setRating(nReview.getRating());
                    reviewm.setSubmittedAt(nReview.getSubmittedAt());
                    
                    return reviewRepository.save(reviewm);
                }).orElseThrow(() -> new LearningProgressNotFoundException(id));
    }

    @DeleteMapping("/api/reviews/{id}")
    public void delete(@PathVariable String id) {
        reviewRepository.deleteById(id);
    }
    
}
