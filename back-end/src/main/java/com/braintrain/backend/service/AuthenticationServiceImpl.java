package com.braintrain.backend.service;


import com.braintrain.backend.exceptionHandler.UserNotFoundException;
import com.braintrain.backend.model.Role;
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
        User user = new User(request.getName(), passwordEncoder.encode(request.getPassword()), request.getEmail());

        userRepository.save(user);
        var jwt = jwtService.generateToken(user);
        return JwtAuthenticationResponse.builder().token(jwt).build();
    }

    @Override
    public JwtAuthenticationResponse signin(SignInRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail());
        String jwt = null;
        if(user != null){
            jwt = jwtService.generateToken(user);
        }else{
            throw new UserNotFoundException("User not found");
        }
        return JwtAuthenticationResponse.builder().token(jwt).build();
    }
}
