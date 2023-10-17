package com.braintrain.backend.controller;

import com.braintrain.backend.model.User;
import com.braintrain.backend.security.dao.JwtAuthenticationResponse;
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
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;


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
        assertThat(exchange.getBody()).isNotNull();
        assertThat(exchange.getBody().getToken()).isNotNull();
    }

    @Test
    void creatingUserWithExistingEmailShouldThrow409() {
        String uri = BASE_URL.formatted(port);
        User user = new User("Edward", "edwardsemail@gmail.com");
        ResponseEntity<User> exchange = restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(user), User.class);
        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(exchange.getHeaders().getLocation()).isNotNull();
    }

    @Test
    void shouldGetUserWhenUserSignsIn() {
        String uri = BASE_URL.formatted(port);
        User user = new User("Edward", "edwardsemail@gmail.com");
        restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(user), User.class);

        ResponseEntity<User> exchange = restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(user), User.class);
        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(exchange.getBody()).isNotNull();
    }

    @Test
    void signingInWithIncorrectCredentialsShouldThrow403() {
        String uri = BASE_URL.formatted(port);
        User user = new User("Edward", "edwardsemail@gmail.com");
        ResponseEntity<User> exchange = restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(user), User.class);
        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(exchange.getHeaders().getLocation()).isNotNull();
    }

}