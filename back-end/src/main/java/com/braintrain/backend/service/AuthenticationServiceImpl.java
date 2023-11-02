package com.braintrain.backend.service;


import com.braintrain.backend.exceptionHandler.exception.EmailAlreadyExistsException;
import com.braintrain.backend.exceptionHandler.exception.UserNotFoundException;
import com.braintrain.backend.model.User;
import com.braintrain.backend.repository.UserRepository;
import com.braintrain.backend.security.dao.JwtAuthenticationResponse;
import com.braintrain.backend.security.dao.SignInRequest;
import com.braintrain.backend.security.dao.SignUpRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    @Override
    public JwtAuthenticationResponse signup(SignUpRequest request) {
        User user = new User(request.getName(), passwordEncoder.encode(request.getPassword()), request.getEmail(), null);

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException();
        }

        userRepository.save(user);
        var jwt = jwtService.generateToken(user);
        return JwtAuthenticationResponse.builder().token(jwt).build();
    }

    @Override
    public JwtAuthenticationResponse signin(SignInRequest request) {
        User user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            throw new UserNotFoundException("User not found for email: " + request.getEmail());
        }
        
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        String jwt = jwtService.generateToken(user);
        return JwtAuthenticationResponse.builder().token(jwt).build();
    }
}
