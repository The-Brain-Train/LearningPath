package com.braintrain.backend.controller;

import com.braintrain.backend.TestHelper;
import com.braintrain.backend.controller.dtos.RoadmapDTO;
import com.braintrain.backend.controller.dtos.RoadmapMetaListDTO;
import com.braintrain.backend.controller.dtos.UserFavoritesDTO;
import com.braintrain.backend.model.*;
import com.braintrain.backend.security.dao.JwtAuthenticationResponse;
import com.braintrain.backend.security.dao.SignInRequest;
import com.braintrain.backend.security.dao.SignUpRequest;
import com.braintrain.backend.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Paths;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
class RoadmapControllerTest {
    @Value("${server.port}")
    private int port;

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    UserService userService;

    private static final String BASE_URL = "http://localhost:%s/api/roadmaps";

    ResponseEntity<RoadmapMeta> exchange;

    @BeforeEach
    public void setup() throws IOException {
        String uri = BASE_URL.formatted(port);
        RoadmapDTO dto = TestHelper.createRoadmapDTO("Java", Paths.get("src/test/resources/java.json"));
        exchange = restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(dto), RoadmapMeta.class);
    }

    @AfterEach
    public void tearDown() {
        if(exchange != null) {
            String uri = "http://localhost:%s/api/roadmaps/%s".formatted(port, exchange.getBody().getId());
            ResponseEntity<Void> exchange = restTemplate.exchange(uri, HttpMethod.DELETE, HttpEntity.EMPTY, Void.class);
            assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        }

        User user = userService.getUserByEmail("edwardsemail@gmail.com");
        if (user != null) {
            userService.deleteUser(user);
        }
    }

    @Test
    void shouldGetRoadmaps() {
        String uri = BASE_URL.formatted(port);
        ResponseEntity<RoadmapMetaListDTO> exchange = restTemplate.exchange(uri, HttpMethod.GET, HttpEntity.EMPTY, RoadmapMetaListDTO.class);
        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(exchange.hasBody()).isTrue();
    }

    @Test
    void shouldCreateRoadmap() throws IOException {
        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(exchange.getHeaders().getLocation()).isNotNull();
    }

    @Test
    void shouldGetRoadmap() {
        String uri = "http://localhost:%s/api/roadmaps/%s".formatted(port, exchange.getBody().getRoadmapReferenceId());
        ResponseEntity<Roadmap> response = restTemplate.exchange(uri, HttpMethod.GET, HttpEntity.EMPTY, Roadmap.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.hasBody()).isTrue();
    }

    @Test
    void shouldGetRoadmapMetasForUser() {
        String signUpURI = "http://localhost:%s/api/auth/signup".formatted(port);
        String signInURI = "http://localhost:%s/api/auth/signin".formatted(port);

        SignUpRequest signUpRequest = new SignUpRequest("Edward", "edwardsemail@gmail.com", "123", "USER");
        SignInRequest signInRequest = new SignInRequest("edwardsemail@gmail.com", "123");

        restTemplate.exchange(signUpURI, HttpMethod.POST, new HttpEntity<>(signUpRequest), JwtAuthenticationResponse.class);
        ResponseEntity<JwtAuthenticationResponse> signInResponse = restTemplate.exchange(signInURI, HttpMethod.POST, new HttpEntity<>(signInRequest), JwtAuthenticationResponse.class);

        JwtAuthenticationResponse jwtAuthenticationResponse = signInResponse.getBody();

        if (jwtAuthenticationResponse != null) {
            String jwtToken = jwtAuthenticationResponse.getToken();
            String uriForGet = "http://localhost:%s/api/roadmaps/%s/roadmapMetas".formatted(port, signInRequest.getEmail());

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + jwtToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<RoadmapMetaListDTO> getResponse = restTemplate.exchange(uriForGet, HttpMethod.GET, entity, RoadmapMetaListDTO.class);

            assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(getResponse.hasBody()).isTrue();
            assertThat(getResponse.getBody().roadmapMetaList().size()).isEqualTo(1);
        }
    }

    @Test
    void getRoadmapMetaListForUserWithInvalidEmailShouldReturn403() {
        String uri = "http://localhost:%s/api/roadmaps/gegerg/roadmapMetas".formatted(port);

        HttpClientErrorException exception = assertThrows(HttpClientErrorException.Forbidden.class, () -> {
            restTemplate.exchange(uri, HttpMethod.GET, HttpEntity.EMPTY, Void.class);
        });

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }

    @Test
    void getInvalidRoadmapShouldReturn404() {
        String uri = "http://localhost:%s/api/roadmaps/df".formatted(port);

        HttpClientErrorException exception = assertThrows(HttpClientErrorException.NotFound.class, () -> {
            restTemplate.exchange(uri, HttpMethod.GET, HttpEntity.EMPTY, Void.class);
        });

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void shouldDeleteRoadmap() {
        String uri = "http://localhost:%s/api/roadmaps/%s".formatted(port, exchange.getBody().getId());
        ResponseEntity<Void> response = restTemplate.exchange(uri, HttpMethod.DELETE, HttpEntity.EMPTY, Void.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    void shouldReturn400WhenCreatingRoadmapWithEmptyName() throws IOException {
        String uri = BASE_URL.formatted(port);
        RoadmapDTO dto = TestHelper.createRoadmapDTO("", Paths.get("src/test/resources/java.json"));

        try {
            ResponseEntity<Void> exchange = restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(dto), Void.class);
            fail("should throw exception");
        } catch (HttpClientErrorException err) {
            assertThat(err.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        }
    }

    @Test
    void shouldReturn400WhenCreatingRoadmapWithEmptyRoadmap() {
        String uri = BASE_URL.formatted(port);
        RoadmapDTO dto = new RoadmapDTO("Java", "", "My email", "", 10);

        try {
            restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(dto), Void.class);
            fail("should throw exception");
        } catch (HttpClientErrorException err) {
            assertThat(err.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        }
    }

    @Test
    void shouldReturn400WhenCreatingRoadmapWithInvalidRoadmapData() throws IOException {
        String uri = BASE_URL.formatted(port);
        RoadmapDTO dto = TestHelper.createRoadmapDTO("JavaScript", Paths.get("src/test/resources/javascript.json"));

        try {
            restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(dto), Void.class);
            fail("should throw exception");
        } catch (HttpClientErrorException err) {
            assertThat(err.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        }
    }

//    @Test
//    void shouldAddRoadmapMetaToFavoritesForExistingUser() {
//        String signUpURI = "http://localhost:%s/api/auth/signup".formatted(port);
//        String signInURI = "http://localhost:%s/api/auth/signin".formatted(port);
//
//        RoadmapMeta roadmapMeta = new RoadmapMeta("Java", "1245", "edwardsemail@gmail.com", "Beginner", 50);
//
//        SignUpRequest signUpRequest = new SignUpRequest("Edward", "edwardsemail@gmail.com", "123", "USER");
//        SignInRequest signInRequest = new SignInRequest("edwardsemail@gmail.com", "123");
//
//        restTemplate.exchange(signUpURI, HttpMethod.POST, new HttpEntity<>(signUpRequest), JwtAuthenticationResponse.class);
//        ResponseEntity<JwtAuthenticationResponse> signInResponse = restTemplate.exchange(signInURI, HttpMethod.POST, new HttpEntity<>(signInRequest), JwtAuthenticationResponse.class);
//
//        JwtAuthenticationResponse jwtAuthenticationResponse = signInResponse.getBody();
//
//        if (jwtAuthenticationResponse != null) {
//            String jwtToken = jwtAuthenticationResponse.getToken();
//            String uri = "http://localhost:%s/api/roadmaps/%s/favorites".formatted(port, signInRequest.getEmail());
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.set("Authorization", "Bearer " + jwtToken);
//            HttpEntity<RoadmapMeta> entity = new HttpEntity<>(roadmapMeta, headers);
//
//            ResponseEntity<UserFavoritesDTO> exchange = restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(entity), UserFavoritesDTO.class);
//
//            assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.CREATED);
//            assertThat(exchange.getHeaders().getLocation()).isNotNull();
//        }
//    }

//    @Test
//    void shouldGetFavoritesForExistingUser() {
//        User user = new User("Edward", "edwardsemail@gmail.com");
//        RoadmapMeta roadmapMeta = new RoadmapMeta("Java", "1245", "anotherEmail@gmail.com", "Beginner", 50);
//
//        String uriForCreateUser = "http://localhost:%s/api/user".formatted(port);
//        restTemplate.exchange(uriForCreateUser, HttpMethod.POST, new HttpEntity<>(user), User.class);
//
//        String postUri = "http://localhost:%s/api/roadmaps/%s/favorites".formatted(port, user.getEmail());
//        restTemplate.exchange(postUri, HttpMethod.POST, new HttpEntity<>(roadmapMeta), UserFavoritesDTO.class);
//
//        String getUri = "http://localhost:%s/api/user/%s/favorites".formatted(port, user.getEmail());
//        ResponseEntity<UserFavoritesDTO> getExchange = restTemplate.exchange(getUri, HttpMethod.GET, HttpEntity.EMPTY, UserFavoritesDTO.class);
//
//        assertThat(getExchange.getStatusCode()).isEqualTo(HttpStatus.OK);
//        assertThat(getExchange.getBody()).isNotNull();
//    }
}