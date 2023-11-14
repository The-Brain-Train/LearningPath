package com.braintrain.backend.service;


import com.braintrain.backend.security.dao.JwtAuthenticationResponse;
import com.braintrain.backend.security.dao.SignInRequest;
import com.braintrain.backend.security.dao.SignUpRequest;

public interface AuthenticationService {
    JwtAuthenticationResponse signup(SignUpRequest request);

    JwtAuthenticationResponse signin(SignInRequest request);
}