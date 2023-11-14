package com.braintrain.backend.service;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserServiceSpringSecurity {
    UserDetailsService userDetailsService();
}
