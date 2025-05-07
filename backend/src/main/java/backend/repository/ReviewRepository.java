package backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import backend.model.Review;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByPostId(String postId);
    
}
