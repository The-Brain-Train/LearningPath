package com.braintrain.backend.security.dao.service;

import com.braintrain.backend.model.User;
import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {
    String extractUsername(String token);
    String generateToken(User user);

    boolean isTokenValid(String token, UserDetails userDetails);
}






