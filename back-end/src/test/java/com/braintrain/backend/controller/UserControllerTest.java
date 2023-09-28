package com.braintrain.backend.controller;

import com.braintrain.backend.model.RoadMapMetaListDTO;
import com.braintrain.backend.model.User;
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
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
class UserControllerTest {
    @Value("${server.port}")
    private int port;
    @Autowired
    RestTemplate restTemplate;
    private static final String BASE_URL = "http://localhost:%s/api/user";

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
    void shouldCreateUserIfNonExisting() {
        String uri = BASE_URL.formatted(port);
        User user = new User("Edward", "edwardsemail@gmail.com");
        ResponseEntity<User> exchange = restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(user), User.class);
        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(exchange.getHeaders().getLocation()).isNotNull();
    }

    @Test
    void shouldGetUserIfUserExists() {

    }

}