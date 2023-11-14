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
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Objects;

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
    private RoadmapMeta createdRoadmapMeta;
    private static String authToken;

    @BeforeEach
    public void setUp() throws IOException {
        String uri = BASE_URL.formatted(port);
        RoadmapDTO dto = TestHelper.createRoadmapDTO("Java", Paths.get("src/test/resources/java.json"));
        exchange = restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(dto), RoadmapMeta.class);
        createdRoadmapMeta = exchange.getBody();
        authToken = signUpAndSignInUser();
    }

    @AfterEach
    public void afterEach() {
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
    void shouldCreateRoadmap() {
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
    void shouldReturnRoadmapWhenRoadmapMetaIdIsGiven() {
        String roadmapMetaId = createdRoadmapMeta.getId();
        if (authToken != null) {
            String uri = "http://localhost:%s/api/roadmaps/findByMeta/%s".formatted(port, roadmapMetaId);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Roadmap> exchange = restTemplate.exchange(uri, HttpMethod.GET, entity, Roadmap.class);

            assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(exchange.getBody()).isNotNull();
            assertThat(exchange.getBody().getId()).isEqualTo(createdRoadmapMeta.getRoadmapReferenceId());
        }
    }

    @Test
    void shouldGetRoadmapMetasForUser() {
        String userEmail = "edwardsemail@gmail.com";

        if (authToken != null) {
            String uriForGet = "http://localhost:%s/api/roadmaps/%s/roadmapMetas".formatted(port, userEmail);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<RoadmapMetaListDTO> getResponse = restTemplate.exchange(uriForGet, HttpMethod.GET, entity, RoadmapMetaListDTO.class);

            assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(getResponse.hasBody()).isTrue();
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

    @Test
    void shouldAddRoadmapMetaToFavoritesForExistingUser() {
        String userEmail = "edwardsemail@gmail.com";

        if (authToken != null) {
            String uri = "http://localhost:%s/api/roadmaps/%s/favorites".formatted(port, userEmail);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            HttpEntity<RoadmapMeta> entity = new HttpEntity<>(createdRoadmapMeta, headers);

            ResponseEntity<UserFavoritesDTO> exchange = restTemplate.exchange(uri, HttpMethod.POST, entity, UserFavoritesDTO.class);

            assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.CREATED);
            assertThat(exchange.getHeaders().getLocation()).isNotNull();
        }
    }

    @Test
    void shouldGetFavoritesForExistingUser() {
        String userEmail = "edwardsemail@gmail.com";

        if (authToken != null) {
            String uri = "http://localhost:%s/api/roadmaps/%s/favorites".formatted(port, userEmail);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<UserFavoritesDTO> exchange = restTemplate.exchange(uri, HttpMethod.GET, entity, UserFavoritesDTO.class);

            assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(exchange.getBody()).isNotNull();
        }
    }

    @Test
    void shouldRemoveRoadmapMetaFromFavoritesForExistingUser() {
        String userEmail = "edwardsemail@gmail.com";

        if (authToken != null) {
            String uri = "http://localhost:%s/api/roadmaps/%s/favorites".formatted(port, userEmail);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            HttpEntity<RoadmapMeta> entity = new HttpEntity<>(createdRoadmapMeta, headers);

            restTemplate.exchange(uri, HttpMethod.POST, entity, UserFavoritesDTO.class);
            ResponseEntity<UserFavoritesDTO> exchange = restTemplate.exchange(uri, HttpMethod.DELETE, entity, UserFavoritesDTO.class);

            assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(Objects.requireNonNull(exchange.getBody()).favorites()).isEmpty();
        }
    }

    @Test
    void shouldIncreaseUpvoteCountWhenUpvoted() {
        String userEmail = "edwardsemail@gmail.com";
        String roadmapMetaId = createdRoadmapMeta.getId();

        if (authToken != null) {
            String uri = "http://localhost:%s/api/roadmaps/%s/upvote/%s".formatted(port, userEmail, roadmapMetaId);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Long> exchange = restTemplate.exchange(uri, HttpMethod.POST, entity, Long.class);

            assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(exchange.getBody()).isEqualTo(1L);
        }
    }

    @Test
    void shouldRemoveUpvoteWhenUpvotingIfAlreadyUpvoted() {
        String userEmail = "edwardsemail@gmail.com";
        String roadmapMetaId = createdRoadmapMeta.getId();

        if (authToken != null) {
            String uri = "http://localhost:%s/api/roadmaps/%s/upvote/%s".formatted(port, userEmail, roadmapMetaId);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Long> exchange1 = restTemplate.exchange(uri, HttpMethod.POST, entity, Long.class);
            ResponseEntity<Long> exchange2 = restTemplate.exchange(uri, HttpMethod.POST, entity, Long.class);

            assertThat(exchange1.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(exchange1.getBody()).isEqualTo(1L);
            assertThat(exchange2.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(exchange2.getBody()).isEqualTo(0L);
        }
    }

    @Test
    void shouldRemoveDownvoteWhenUpvoting() {
        String userEmail = "edwardsemail@gmail.com";
        String roadmapMetaId = createdRoadmapMeta.getId();

        if (authToken != null) {
            String uriUpvote = "http://localhost:%s/api/roadmaps/%s/upvote/%s".formatted(port, userEmail, roadmapMetaId);
            String uriDownvote = "http://localhost:%s/api/roadmaps/%s/downvote/%s".formatted(port, userEmail, roadmapMetaId);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Long> exchange1 = restTemplate.exchange(uriUpvote, HttpMethod.POST, entity, Long.class);
            ResponseEntity<Long> exchange2 = restTemplate.exchange(uriDownvote, HttpMethod.POST, entity, Long.class);
            ResponseEntity<Long> exchange3 = restTemplate.exchange(uriUpvote, HttpMethod.POST, entity, Long.class);

            assertThat(exchange1.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(exchange1.getBody()).isEqualTo(1L);
            assertThat(exchange2.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(exchange2.getBody()).isEqualTo(1L);
            assertThat(exchange3.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(exchange3.getBody()).isEqualTo(1L);
        }
    }

    @Test
    void shouldIncreaseDownvoteCountWhenDownvoted() {
        String userEmail = "edwardsemail@gmail.com";
        String roadmapMetaId = createdRoadmapMeta.getId();

        if (authToken != null) {
            String uri = "http://localhost:%s/api/roadmaps/%s/downvote/%s".formatted(port, userEmail, roadmapMetaId);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Long> exchange = restTemplate.exchange(uri, HttpMethod.POST, entity, Long.class);

            assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(exchange.getBody()).isEqualTo(1L);
        }
    }

    @Test
    void shouldRemoveDownvoteWhenDownvotingIfAlreadyDownvoted() {
        String userEmail = "edwardsemail@gmail.com";
        String roadmapMetaId = createdRoadmapMeta.getId();

        if (authToken != null) {
            String uri = "http://localhost:%s/api/roadmaps/%s/downvote/%s".formatted(port, userEmail, roadmapMetaId);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Long> exchange1 = restTemplate.exchange(uri, HttpMethod.POST, entity, Long.class);
            ResponseEntity<Long> exchange2 = restTemplate.exchange(uri, HttpMethod.POST, entity, Long.class);

            assertThat(exchange1.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(exchange1.getBody()).isEqualTo(1L);
            assertThat(exchange2.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(exchange2.getBody()).isEqualTo(0L);
        }
    }

    @Test
    void shouldRemoveUpvoteWhenDownvoting() {
        String userEmail = "edwardsemail@gmail.com";
        String roadmapMetaId = createdRoadmapMeta.getId();

        if (authToken != null) {
            String uriUpvote = "http://localhost:%s/api/roadmaps/%s/upvote/%s".formatted(port, userEmail, roadmapMetaId);
            String uriDownvote = "http://localhost:%s/api/roadmaps/%s/downvote/%s".formatted(port, userEmail, roadmapMetaId);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Long> exchange1 = restTemplate.exchange(uriDownvote, HttpMethod.POST, entity, Long.class);
            ResponseEntity<Long> exchange2 = restTemplate.exchange(uriUpvote, HttpMethod.POST, entity, Long.class);
            ResponseEntity<Long> exchange3 = restTemplate.exchange(uriDownvote, HttpMethod.POST, entity, Long.class);

            assertThat(exchange1.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(exchange1.getBody()).isEqualTo(1L);
            assertThat(exchange2.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(exchange2.getBody()).isEqualTo(1L);
            assertThat(exchange3.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(exchange3.getBody()).isEqualTo(1L);
        }
    }

    private String signUpAndSignInUser() {
        String signUpURI = "http://localhost:%s/api/auth/signup".formatted(port);
        String signInURI = "http://localhost:%s/api/auth/signin".formatted(port);

        SignUpRequest signUpRequest = new SignUpRequest("Edward", "edwardsemail@gmail.com", "123", "USER");
        SignInRequest signInRequest = new SignInRequest("edwardsemail@gmail.com", "123");

        restTemplate.exchange(signUpURI, HttpMethod.POST, new HttpEntity<>(signUpRequest), JwtAuthenticationResponse.class);

        ResponseEntity<JwtAuthenticationResponse> signInResponse = restTemplate.exchange(signInURI, HttpMethod.POST, new HttpEntity<>(signInRequest), JwtAuthenticationResponse.class);
        JwtAuthenticationResponse jwtAuthenticationResponse = signInResponse.getBody();
        if (jwtAuthenticationResponse != null) {
            return jwtAuthenticationResponse.getToken();
        }
        return null;
    }
}