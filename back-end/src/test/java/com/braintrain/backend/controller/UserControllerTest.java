package com.braintrain.backend.controller;

import com.braintrain.backend.model.RoadmapMeta;
import com.braintrain.backend.model.User;
import com.braintrain.backend.controller.dtos.UserFavoritesDTO;
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

import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;

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
        User user = new User("Edward", "edwardsemail@gmail.com", new ArrayList<>());
        ResponseEntity<User> exchange = restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(user), User.class);
        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(exchange.getHeaders().getLocation()).isNotNull();
    }

    @Test
    void shouldGetUserIfUserExists() {
        String uri = BASE_URL.formatted(port);
        User user = new User("Edward", "edwardsemail@gmail.com", new ArrayList<>());
        restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(user), User.class);

        ResponseEntity<User> exchange = restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(user), User.class);
        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(exchange.getBody()).isNotNull();
    }

    @Test
    void shouldGetFavoritesForExistingUser() {
        User user = new User("Edward", "edwardsemail@gmail.com", new ArrayList<>());
        RoadmapMeta roadmapMeta = new RoadmapMeta("Java", "1245", "anotherEmail@gmail.com", "Beginner", 50);

        String uriForCreateUser = "http://localhost:%s/api/user".formatted(port);
        restTemplate.exchange(uriForCreateUser, HttpMethod.POST, new HttpEntity<>(user), User.class);

        String postUri = "http://localhost:%s/api/roadmaps/%s/favorites".formatted(port, user.getEmail());
        restTemplate.exchange(postUri, HttpMethod.POST, new HttpEntity<>(roadmapMeta), UserFavoritesDTO.class);

        String getUri = "http://localhost:%s/api/user/%s/favorites".formatted(port, user.getEmail());
        ResponseEntity<UserFavoritesDTO> getExchange = restTemplate.exchange(getUri, HttpMethod.GET, HttpEntity.EMPTY, UserFavoritesDTO.class);

        assertThat(getExchange.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getExchange.getBody()).isNotNull();
    }
}