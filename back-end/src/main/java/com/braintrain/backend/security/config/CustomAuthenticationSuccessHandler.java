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
        if (authentication.getPrincipal() instanceof OidcUser oidcUser) {
//            try {
//                jwtServiceImpl.validateJWTString(oidcUser.getIdToken().getTokenValue());
//            } catch (JwtException e) {
//                response.sendRedirect("http://localhost:3000/signin");
//            }

            String email = oidcUser.getAttributes().get("email").toString();
            String userName = oidcUser.getAttributes().get("name").toString();

            User user = userRepository.findByEmail(email);
            String token;
            if (user != null){
                token = jwtServiceImpl.generateToken(user);
            } else{
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(userName);
                userRepository.save(newUser);
                token = jwtServiceImpl.generateToken(newUser);
            }
            response.addCookie(createNewCookie(token));
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.sendRedirect("http://localhost:3000/");
        }
    }

    private Cookie createNewCookie(String tokenValue) {
        Cookie cookie = new Cookie("user", tokenValue);
        cookie.setHttpOnly(true);
        cookie.setMaxAge(3500);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setDomain(getDomain("http://localhost:3000/"));
        System.out.println(cookie);
        return cookie;
    }

    private String getDomain(String url) {
        if ("https://learning-path-brain-train.vercel.app/".equals(url)) {
            return "learning-path-brain-train.vercel.app";
        }
        return "localhost";
    }
}

