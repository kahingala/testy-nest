package backend.controller;

import backend.model.UserModel;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OAuthController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/oauth2/success")
    public ResponseEntity<?> handleGoogleLogin(Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        UserModel user;
        // Check if user already exists
        if (!userRepository.existsByEmail(email)) {
            user = new UserModel();
            user.setEmail(email);
            user.setFullname(name);
            userRepository.save(user);
        } else {
            user = userRepository.findByEmail(email).orElseThrow(() -> 
                new IllegalStateException("User not found despite existence check"));
        }

        String redirectUrl = String.format(
            "http://localhost:3000/oauth2/success?userID=%s&name=%s",
            user.getId().toString(),
            user.getFullname()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Control-Allow-Origin", "http://localhost:3000");
        headers.add("Access-Control-Allow-Credentials", "true");
        headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "*");
        
        return ResponseEntity.status(302)
                .headers(headers)
                .body(new RedirectView(redirectUrl));
    }

    @GetMapping("/oauth2/authorization/google")
    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    public ResponseEntity<?> initiateGoogleLogin() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Access-Control-Allow-Origin", "http://localhost:3000");
        headers.add("Access-Control-Allow-Credentials", "true");
        return ResponseEntity.ok().headers(headers).build();
    }
}
