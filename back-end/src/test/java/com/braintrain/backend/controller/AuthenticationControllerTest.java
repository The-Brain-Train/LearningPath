package com.braintrain.backend.controller;

import com.braintrain.backend.model.User;
import com.braintrain.backend.security.dao.JwtAuthenticationResponse;
import com.braintrain.backend.security.dao.SignInRequest;
import com.braintrain.backend.security.dao.SignUpRequest;
import com.braintrain.backend.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
class AuthenticationControllerTest {

    @Value("${server.port}")
    private int port;
    @Autowired
    RestTemplate restTemplate;
    private static final String BASE_URL = "http://localhost:%s/api/auth";

    @Autowired
    private UserService userService;

    @AfterEach
    void tearDown() {
        String email = "edwardsemail@gmail.com";

        User user = userService.getUserByEmail(email);
        if (user != null) {
            userService.deleteUser(user);
        }
    }
    @Test
    void shouldCreateUserWhenUserSignsUp() {
        String uri = "http://localhost:%s/api/auth/signup".formatted(port);
        SignUpRequest signUpRequest = new SignUpRequest("Edward", "edwardsemail@gmail.com", "123", "USER");

        ResponseEntity<JwtAuthenticationResponse> exchange = restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(signUpRequest), JwtAuthenticationResponse.class);

        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(exchange.getBody().getToken()).isNotNull();
    }

    @Test
    void creatingUserWithExistingEmailShouldThrow409() {
        String uri = "http://localhost:%s/api/auth/signup".formatted(port);
        SignUpRequest signUpRequest = new SignUpRequest("Edward", "edwardsemail@gmail.com", "123", "USER");

        restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(signUpRequest), JwtAuthenticationResponse.class);

        try {
            restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(signUpRequest), JwtAuthenticationResponse.class);
            fail("Expected EmailAlreadyExistsException with status code 409");
        } catch (HttpClientErrorException e) {
            assertEquals(HttpStatus.CONFLICT, e.getStatusCode());
        }
    }

    @Test
    void shouldGetUserWhenUserSignsIn() {
        String signUpURI = "http://localhost:%s/api/auth/signup".formatted(port);
        String signInURI = "http://localhost:%s/api/auth/signin".formatted(port);

        SignUpRequest signUpRequest = new SignUpRequest("Edward", "edwardsemail@gmail.com", "123", "USER");
        SignInRequest signInRequest = new SignInRequest("edwardsemail@gmail.com", "123");

        restTemplate.exchange(signUpURI, HttpMethod.POST, new HttpEntity<>(signUpRequest), JwtAuthenticationResponse.class);
        ResponseEntity<JwtAuthenticationResponse> exchange = restTemplate.exchange(signInURI, HttpMethod.POST, new HttpEntity<>(signInRequest), JwtAuthenticationResponse.class);

        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(exchange.getBody().getToken()).isNotNull();
    }

    @Test
    void signingInWithIncorrectCredentialsShouldThrow403() {
        String signUpURI = "http://localhost:%s/api/auth/signup".formatted(port);
        String signInURI = "http://localhost:%s/api/auth/signin".formatted(port);

        SignUpRequest signUpRequest = new SignUpRequest("Edward", "edwardsemail@gmail.com", "123", "USER");
        SignInRequest signInRequest = new SignInRequest("edwardsemai@gmail.com", "123");

        restTemplate.exchange(signUpURI, HttpMethod.POST, new HttpEntity<>(signUpRequest), JwtAuthenticationResponse.class);

        try {
            restTemplate.exchange(signInURI, HttpMethod.POST, new HttpEntity<>(signInRequest), JwtAuthenticationResponse.class);
            fail("Expected EmailAlreadyExistsException with status code 409");
        } catch (HttpClientErrorException e) {
            assertEquals(HttpStatus.FORBIDDEN, e.getStatusCode());
        }
    }

}