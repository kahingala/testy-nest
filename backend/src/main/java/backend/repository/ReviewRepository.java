package backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import backend.model.Review;


public interface ReviewRepository extends MongoRepository<Review, String> {
    
}
