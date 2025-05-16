package backend.controller;

import backend.model.UserModel;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RestController
public class OAuthController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/oauth2/success")
    public ResponseEntity<?> handleGoogleLogin(Authentication authentication) {
        try {
            if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User)) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid authentication state"
                ));
            }

            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = oAuth2User.getAttributes();
            
            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");
            String picture = (String) attributes.get("picture");
            
            if (email == null || name == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Required user information not provided by Google"
                ));
            }

            UserModel user;
            if (!userRepository.existsByEmail(email)) {
                user = new UserModel();
                user.setEmail(email);
                user.setFullname(name);
                // You might want to store the profile picture URL if you have a field for it
                user = userRepository.save(user);
            } else {
                user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalStateException("User not found despite existence check"));
            }

            String redirectUrl = String.format(
                "http://localhost:3000/oauth2/success?userID=%s&name=%s&email=%s",
                user.getId(),
                user.getFullname(),
                user.getEmail()
            );

            return ResponseEntity.ok(Map.of(
                "redirectUrl", redirectUrl,
                "user", Map.of(
                    "id", user.getId(),
                    "name", user.getFullname(),
                    "email", user.getEmail(),
                    "picture", picture
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to process Google login: " + e.getMessage()
            ));
        }
    }
}
