package backend.controller;

import backend.exception.LearningSystemNotFoundException;
import backend.exception.UserNotFoundException;
import backend.model.Comment;
import backend.model.LearningSystemModel;
import backend.model.NotificationModel;
import backend.model.Review;
import backend.repository.LearningSystemRepository;
import backend.repository.NotificationRepository;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin("http://localhost:3000")
public class LearningSystemController {
    @Autowired
    private LearningSystemRepository learningSystemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping("/learningSystem")
    public LearningSystemModel newLearningSystemModel(@RequestBody LearningSystemModel newLearningSystemModel) {
        if (newLearningSystemModel.getPostOwnerID() == null || newLearningSystemModel.getPostOwnerID().isEmpty()) {
            throw new IllegalArgumentException("PostOwnerID is required.");
        }
        String postOwnerName = userRepository.findById(newLearningSystemModel.getPostOwnerID())
                .map(user -> user.getFullname())
                .orElseThrow(() -> new UserNotFoundException("User not found for ID: " + newLearningSystemModel.getPostOwnerID()));
        newLearningSystemModel.setPostOwnerName(postOwnerName);
        String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        newLearningSystemModel.setCreatedAt(currentDateTime);
        return learningSystemRepository.save(newLearningSystemModel);
    }

    @GetMapping("/learningSystem")
    List<LearningSystemModel> getAll() {
        List<LearningSystemModel> posts = learningSystemRepository.findAll();
        posts.forEach(post -> System.out.println("Fetched post: " + post));
        return posts;
    }

    @GetMapping("/learningSystem/{id}")
    LearningSystemModel getById(@PathVariable String id) {
        return learningSystemRepository.findById(id)
                .orElseThrow(() -> new LearningSystemNotFoundException(id));
    }

    @PutMapping("/learningSystem/{id}")
    LearningSystemModel update(@RequestBody LearningSystemModel newLearningSystemModel, @PathVariable String id) {
        return learningSystemRepository.findById(id)
                .map(learningSystemModel -> {
                    learningSystemModel.setTitle(newLearningSystemModel.getTitle());
                    learningSystemModel.setDescription(newLearningSystemModel.getDescription());
                    learningSystemModel.setContentURL(newLearningSystemModel.getContentURL());
                    learningSystemModel.setTags(newLearningSystemModel.getTags());
                    if (newLearningSystemModel.getPostOwnerID() != null && !newLearningSystemModel.getPostOwnerID().isEmpty()) {
                        learningSystemModel.setPostOwnerID(newLearningSystemModel.getPostOwnerID());
                    }
                    return learningSystemRepository.save(learningSystemModel);
                }).orElseThrow(() -> new LearningSystemNotFoundException(id));
    }

    @DeleteMapping("/learningSystem/{id}")
    public void delete(@PathVariable String id) {
        learningSystemRepository.deleteById(id);
    }

    @PutMapping("/learningSystem/{id}/like")
    public LearningSystemModel likePost(@PathVariable String id, @RequestParam String userID) {
        return learningSystemRepository.findById(id)
                .map(post -> {
                    post.getLikes().put(userID, !post.getLikes().getOrDefault(userID, false));
                    learningSystemRepository.save(post);
                    if (!userID.equals(post.getPostOwnerID())) {
                        String userFullName = userRepository.findById(userID)
                                .map(user -> user.getFullname())
                                .orElse("Someone");
                        String message = String.format("%s liked your %s post", userFullName, post.getTitle());
                        String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                        NotificationModel notification = new NotificationModel(post.getPostOwnerID(), message, false, currentDateTime);
                        notificationRepository.save(notification);
                    }
                    return post;
                }).orElseThrow(() -> new LearningSystemNotFoundException(id));
    }

    @PostMapping("/learningSystem/{id}/comment")
    public LearningSystemModel addComment(@PathVariable String id, @RequestBody Comment comment) {
        String userFullName = userRepository.findById(comment.getUserID())
                .map(user -> user.getFullname())
                .orElseThrow(() -> new UserNotFoundException("User not found for ID: " + comment.getUserID()));
        comment.setUserFullName(userFullName);
        return learningSystemRepository.findById(id)
                .map(post -> {
                    comment.setId(UUID.randomUUID().toString());
                    post.getComments().add(comment);
                    learningSystemRepository.save(post);
                    if (!comment.getUserID().equals(post.getPostOwnerID())) {
                        String message = String.format("%s commented on your %s post", userFullName, post.getTitle());
                        String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                        NotificationModel notification = new NotificationModel(post.getPostOwnerID(), message, false, currentDateTime);
                        notificationRepository.save(notification);
                    }
                    return post;
                }).orElseThrow(() -> new LearningSystemNotFoundException(id));
    }

    @PutMapping("/learningSystem/{id}/comment/{commentId}")
    public LearningSystemModel updateComment(@PathVariable String id, @PathVariable String commentId, @RequestBody Comment updatedComment) {
        return learningSystemRepository.findById(id)
                .map(post -> {
                    post.getComments().stream()
                            .filter(comment -> comment.getId().equals(commentId) && comment.getUserID().equals(updatedComment.getUserID()))
                            .findFirst()
                            .ifPresent(comment -> comment.setContent(updatedComment.getContent()));
                    return learningSystemRepository.save(post);
                }).orElseThrow(() -> new LearningSystemNotFoundException(id));
    }

    @DeleteMapping("/learningSystem/{id}/comment/{commentId}")
    public LearningSystemModel deleteComment(@PathVariable String id, @PathVariable String commentId, @RequestParam String userID) {
        return learningSystemRepository.findById(id)
                .map(post -> {
                    post.getComments().removeIf(comment -> comment.getId().equals(commentId) &&
                            (comment.getUserID().equals(userID) || post.getPostOwnerID().equals(userID)));
                    return learningSystemRepository.save(post);
                }).orElseThrow(() -> new LearningSystemNotFoundException(id));
    }

    @PostMapping("/learningSystem/{id}/review")
    public LearningSystemModel addReview(@PathVariable String id, @RequestBody Review review) {
        if (review.getRating() == null || review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }
        if (review.getReviewText() == null || review.getReviewText().trim().isEmpty()) {
            throw new IllegalArgumentException("Review text is required.");
        }

        String userFullName = userRepository.findById(review.getUserID())
                .map(user -> user.getFullname())
                .orElseThrow(() -> new UserNotFoundException("User not found for ID: " + review.getUserID()));
        review.setUserFullName(userFullName);

        String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        review.setCreatedAt(currentDateTime);

        return learningSystemRepository.findById(id)
                .map(post -> {
                    review.setId(UUID.randomUUID().toString());
                    post.getReviews().add(review);
                    learningSystemRepository.save(post);

                    if (!review.getUserID().equals(post.getPostOwnerID())) {
                        String message = String.format("%s reviewed your %s post with %d stars", userFullName, post.getTitle(), review.getRating());
                        NotificationModel notification = new NotificationModel(post.getPostOwnerID(), message, false, currentDateTime);
                        notificationRepository.save(notification);
                    }

                    return post;
                }).orElseThrow(() -> new LearningSystemNotFoundException(id));
    }

    @PutMapping("/learningSystem/{id}/review/{reviewId}")
    public LearningSystemModel updateReview(@PathVariable String id, @PathVariable String reviewId, @RequestBody Review updatedReview) {
        if (updatedReview.getRating() != null && (updatedReview.getRating() < 1 || updatedReview.getRating() > 5)) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }
        if (updatedReview.getReviewText() != null && updatedReview.getReviewText().trim().isEmpty()) {
            throw new IllegalArgumentException("Review text cannot be empty.");
        }

        return learningSystemRepository.findById(id)
                .map(post -> {
                    post.getReviews().stream()
                            .filter(review -> review.getId().equals(reviewId) && review.getUserID().equals(updatedReview.getUserID()))
                            .findFirst()
                            .ifPresent(review -> {
                                if (updatedReview.getRating() != null) {
                                    review.setRating(updatedReview.getRating());
                                }
                                if (updatedReview.getReviewText() != null) {
                                    review.setReviewText(updatedReview.getReviewText());
                                }
                                // Notify post owner of update
                                if (!updatedReview.getUserID().equals(post.getPostOwnerID())) {
                                    String userFullName = userRepository.findById(updatedReview.getUserID())
                                            .map(user -> user.getFullname())
                                            .orElse("Someone");
                                    String message = String.format("%s updated their review on your %s post", userFullName, post.getTitle());
                                    String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                                    NotificationModel notification = new NotificationModel(post.getPostOwnerID(), message, false, currentDateTime);
                                    notificationRepository.save(notification);
                                }
                            });
                    return learningSystemRepository.save(post);
                }).orElseThrow(() -> new LearningSystemNotFoundException(id));
    }

    @DeleteMapping("/learningSystem/{id}/review/{reviewId}")
    public LearningSystemModel deleteReview(@PathVariable String id, @PathVariable String reviewId, @RequestParam String userID) {
        return learningSystemRepository.findById(id)
                .map(post -> {
                    post.getReviews().removeIf(review -> review.getId().equals(reviewId) &&
                            (review.getUserID().equals(userID) || post.getPostOwnerID().equals(userID)));
                    learningSystemRepository.save(post);
                    // Notify post owner of deletion
                    if (!userID.equals(post.getPostOwnerID())) {
                        String userFullName = userRepository.findById(userID)
                                .map(user -> user.getFullname())
                                .orElse("Someone");
                        String message = String.format("%s deleted their review on your %s post", userFullName, post.getTitle());
                        String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                        NotificationModel notification = new NotificationModel(post.getPostOwnerID(), message, false, currentDateTime);
                        notificationRepository.save(notification);
                    }
                    return post;
                }).orElseThrow(() -> new LearningSystemNotFoundException(id));
    }
}