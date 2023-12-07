package com.braintrain.backend.security.config;


import com.braintrain.backend.model.User;
import com.braintrain.backend.repository.UserRepository;
import com.braintrain.backend.service.JwtServiceImpl;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;



import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtServiceImpl jwtServiceImpl;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        if (authentication.getPrincipal() instanceof DefaultOAuth2User) {
            DefaultOAuth2User oauth2User = (DefaultOAuth2User) authentication.getPrincipal();

            // Extract the necessary information from oauth2User, such as username
            String email = oauth2User.getAttributes().get("email").toString();
            String userName = oauth2User.getAttributes().get("name").toString();
            // first check if email address is present in your data base
            User user = userRepository.findByEmail(email);
            String token = "";
            if(user != null){
                token = jwtServiceImpl.generateToken(user);
            }else{
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(userName);
                userRepository.save(newUser);
                token = jwtServiceImpl.generateToken(newUser);
            }
            // Generate JWT token if needed
            //String jwtToken = jwtValidation.generateToken(username);
        }

        // If the authentication is not OIDC user, you may handle other cases here

        response.setHeader("Access-Control-Allow-Credentials", "true");
    }
}

