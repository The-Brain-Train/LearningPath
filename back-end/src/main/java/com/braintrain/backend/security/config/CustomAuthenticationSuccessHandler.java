package com.braintrain.backend.security.config;

import com.braintrain.backend.model.User;
import com.braintrain.backend.repository.UserRepository;
import com.braintrain.backend.service.JwtServiceImpl;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private final JwtServiceImpl jwtServiceImpl;
    private final UserRepository userRepository;
    private final WebsiteProperties websiteProperties;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        if (authentication.getPrincipal() instanceof OidcUser oidcUser) {
            String token;

            try {
                jwtServiceImpl.validateJWTString(oidcUser.getIdToken().getTokenValue());
            } catch (JwtException e) {
                response.sendRedirect(websiteProperties.frontend() + "signin");
            }

            String email = oidcUser.getAttributes().get("email").toString();
            String userName = oidcUser.getAttributes().get("name").toString();
            String profilePicture = oidcUser.getAttributes().get("picture").toString();

            User user = userRepository.findByEmail(email);

            if (user != null){
                token = jwtServiceImpl.generateToken(user);
            } else{
                User newUser = new User(userName, email, profilePicture);

                userRepository.save(newUser);
                token = jwtServiceImpl.generateToken(newUser);
            }
            System.out.println(createNewCookie(token));
            response.addCookie(createNewCookie(token));
            response.sendRedirect(websiteProperties.frontend());
        }
    }

    private Cookie createNewCookie(String tokenValue) {
        Cookie cookie = new Cookie("user", tokenValue);
        cookie.setSecure(true);
        cookie.setMaxAge(350000);
        cookie.setPath("/");
        cookie.setDomain("learning-path.onrender.com");
        System.out.println(cookie.getDomain());
        return cookie;
    }

    // private String getDomain(String url) {
    //     if (websiteProperties.frontend().equals(url)) {
    //         System.out.println(url);
    //         return "learning-path-pi.vercel";
    //     }
    //     System.out.println("not triggered");
    //     return "localhost";
    // }
}

