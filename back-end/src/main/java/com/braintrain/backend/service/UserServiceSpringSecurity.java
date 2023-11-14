package com.braintrain.backend.security.dao.service;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserServiceSpringSecurity {
    UserDetailsService userDetailsService();
}
