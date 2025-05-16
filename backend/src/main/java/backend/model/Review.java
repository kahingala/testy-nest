package backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.GeneratedValue;

@Document(collection = "reviews")
public class Review {
    @Id
    @GeneratedValue
    private String id;
    private String postId;
    private String userId;
    private String userName;
    private int rating;
    private String comment;
    private LocalDateTime submittedAt;

    public Review(String id, String postId, String userId, String userName, int rating, String comment,
            LocalDateTime submittedAt) {
        this.id = id;
        this.postId = postId;
        this.userId = userId;
        this.userName = userName;
        this.rating = rating;
        this.comment = comment;
        this.submittedAt = submittedAt;
    }

    public Review(){
        
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getId() {
        return id;
    }

    public String getPostId() {
        return postId;
    }

    public String getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public int getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    
}
