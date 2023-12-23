package com.braintrain.backend.controller;

import com.braintrain.backend.TestHelper;
import com.braintrain.backend.controller.dtos.RoadmapDTO;
import com.braintrain.backend.controller.dtos.RoadmapMetaDTO;
import com.braintrain.backend.controller.dtos.RoadmapMetaListDTO;
import com.braintrain.backend.controller.dtos.UserFavoritesDTO;
import com.braintrain.backend.model.*;
import com.braintrain.backend.security.dao.JwtAuthenticationResponse;
import com.braintrain.backend.security.dao.SignUpRequest;
import com.braintrain.backend.service.UserService;
import com.braintrain.backend.util.CustomPageImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.List;

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
    private ObjectMapper objectMapper;
    @Autowired
    UserService userService;
    private static final String BASE_URL = "http://localhost:%s/api/roadmaps";
    ResponseEntity<RoadmapMeta> exchange;
    private RoadmapMeta createdRoadmapMeta;
    private static String authToken;
    private static String secondUserAuthToken;
    private List<String> filterRoadmapMetaIds;
    @BeforeEach
    public void setUp() throws IOException {
        String uri = BASE_URL.formatted(port);
        RoadmapDTO dto = TestHelper.createRoadmapDTO("Java", Paths.get("src/test/resources/testJsons/java.json"));
        exchange = restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(dto), RoadmapMeta.class);
        createdRoadmapMeta = exchange.getBody();
        createRoadmaps();
        authToken = signUpAndSignInUser("edwardsemail@gmail.com");
        secondUserAuthToken = signUpAndSignInUser("123@gmail.com");
    }

    @AfterEach
    public void afterEach() {
        if (exchange != null) {
            String uri = "http://localhost:%s/api/roadmaps/%s".formatted(port, exchange.getBody().getId());
            ResponseEntity<Void> exchange = restTemplate.exchange(uri, HttpMethod.DELETE, HttpEntity.EMPTY, Void.class);
            assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
            deleteRoadmaps();
        }

        User user = userService.getUserByEmail("edwardsemail@gmail.com");
        User user2 = userService.getUserByEmail("123@gmail.com");
        if (user != null) {
            userService.deleteUser(user);
        }
        if (user2 != null) {
            userService.deleteUser(user2);
        }
    }

    @Test
    void shouldGetRoadmaps() {
        String uri = BASE_URL.formatted(port);
        ResponseEntity<RoadmapMetaListDTO> exchange =
                restTemplate.exchange(uri, HttpMethod.GET, HttpEntity.EMPTY, RoadmapMetaListDTO.class);
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
        String uri = "http://localhost:%s/api/roadmaps/findRoadmapByMeta/%s".formatted(port, roadmapMetaId);

        ResponseEntity<Roadmap> exchange = restTemplate.exchange(uri, HttpMethod.GET, HttpEntity.EMPTY, Roadmap.class);

        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(exchange.getBody()).isNotNull();
        assertThat(exchange.getBody().getId()).isEqualTo(createdRoadmapMeta.getRoadmapReferenceId());
    }

    @ParameterizedTest
    @CsvSource({
            "Java,,0,500,0,9,3",
            ",beginner,0,500,0,9,3",
            ",,50,150,0,9,2",
            "Java,intermediate,100,200,0,9,1",
            "Python,,150,250,0,9,2",
            ",beginner,150,175,0,9,0"
    })
    void shouldFilterRoadmaps(
            String name, String experienceLevel, int fromHour, int toHour, int page, int size, int expectedCount) {

        String queryString =
                TestHelper.buildQueryStringForFilterRoadmapsTest(name, experienceLevel, fromHour, toHour, page, size);

        String uri = "http://localhost:%s/api/roadmaps/filter?%s".formatted(port, queryString);

        ResponseEntity<CustomPageImpl<RoadmapMetaDTO>> response =
                restTemplate.exchange(uri, HttpMethod.GET, HttpEntity.EMPTY, new ParameterizedTypeReference<>() {
                });

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.hasBody()).isTrue();
//        assertThat(response.getBody().getContent().size()).isEqualTo(expectedCount);
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
        RoadmapDTO dto = TestHelper.createRoadmapDTO("", Paths.get("src/test/resources/testJsons/java.json"));

        try {
            restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(dto), Void.class);
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
        RoadmapDTO dto = TestHelper.createRoadmapDTO("JavaScript", Paths.get("src/test/resources/testJsons/javascript.json"));

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

    @Test
    void shouldUpdateRoadmapTopicStatus() {
        String userEmail = "edwardsemail@gmail.com";
        String roadmapMetaId = createdRoadmapMeta.getId();
        String completedTopic = "Syntax";

        if (authToken != null) {
            String uriToUpdateStatus = "http://localhost:%s/api/roadmaps/%s/completedTopic/%s".formatted(port, userEmail, roadmapMetaId);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            HttpEntity<String> entity = new HttpEntity<>(completedTopic, headers);

            ResponseEntity<Roadmap> updatedRoadmap = restTemplate.exchange(uriToUpdateStatus, HttpMethod.PUT, entity, Roadmap.class);

            boolean checkForUpdatedTopic = checkIfTopicUpdatedInRoadmap(Objects.requireNonNull(updatedRoadmap.getBody()), completedTopic);

            assertThat(updatedRoadmap.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(checkForUpdatedTopic).isTrue();
        }
    }

    @Test
    void shouldReturn404IfTopicDoesNotExistOnRoadmap() {
        String userEmail = "edwardsemail@gmail.com";
        String roadmapMetaId = createdRoadmapMeta.getId();
        String completedTopic = "hrhhe";

        if (authToken != null) {
            String uriToUpdateStatus = "http://localhost:%s/api/roadmaps/%s/completedTopic/%s".formatted(port, userEmail, roadmapMetaId);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            HttpEntity<String> entity = new HttpEntity<>(completedTopic, headers);

            try {
                restTemplate.exchange(uriToUpdateStatus, HttpMethod.PUT, entity, Void.class);
                fail("should throw exception");
            } catch (HttpClientErrorException err) {
                assertThat(err.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
            }
        }
    }

    @Test
    void shouldCreateCopyOfRoadmapWithUserEmail() {
        String userEmail = "123@gmail.com";
        String roadmapMetaId = createdRoadmapMeta.getId();

        if (secondUserAuthToken != null) {
            String uri= "http://localhost:%s/api/roadmaps/%s/createRoadmapCopy/%s".formatted(port, userEmail, roadmapMetaId);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<RoadmapMeta> response = restTemplate.exchange(uri, HttpMethod.POST, entity, RoadmapMeta.class);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }

    @Test
    void shouldReturn400IfRoadmapOwnerAttemptsToCreateCopyOfOwnRoadmap() {
        String userEmail = "edwardsemail@gmail.com";
        String roadmapMetaId = createdRoadmapMeta.getId();

        if (authToken != null) {
            String uri= "http://localhost:%s/api/roadmaps/%s/createRoadmapCopy/%s".formatted(port, userEmail, roadmapMetaId);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            try {
                restTemplate.exchange(uri, HttpMethod.POST, entity, RoadmapMeta.class);
                fail("should throw exception");
            } catch (HttpClientErrorException err) {
                assertThat(err.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            }
        }
    }

    @Test
    void newCopyOfRoadmapShouldBeCreatedWithNoTopicsCompleted() {
        String roadmapMetaId = createdRoadmapMeta.getId();
        String userEmail = "123@gmail.com";
        boolean isAnyTopicCompleted = false;

        if (secondUserAuthToken != null) {
            String uri= "http://localhost:%s/api/roadmaps/%s/createRoadmapCopy/%s".formatted(port, userEmail, roadmapMetaId);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + authToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Roadmap> copiedRoadmap = restTemplate.exchange(uri, HttpMethod.POST, entity, Roadmap.class);

            try {
                String roadmapData = copiedRoadmap.getBody().getObj();
                RoadmapContent roadmapContent = objectMapper.readValue(roadmapData, RoadmapContent.class);

                isAnyTopicCompleted = checkIfAnyChildTopicIsCompleted(roadmapContent.getChildren());

                assertFalse(isAnyTopicCompleted);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private boolean checkIfAnyChildTopicIsCompleted(List<RoadmapContentChild> children) {
        if (children != null) {
            for (RoadmapContentChild child : children) {
                if (child.isCompletedTopic()) {
                    return true;
                }
                if (checkIfAnyChildTopicIsCompleted(child.getChildren())) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean checkIfTopicUpdatedInRoadmap(Roadmap roadmap, String completedTopic) {
        String roadmapDataString = roadmap.getObj();
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            RoadmapContent roadmapContent = objectMapper.readValue(roadmapDataString, RoadmapContent.class);
            return searchCompletedTopic(roadmapContent.getChildren(), completedTopic);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private boolean searchCompletedTopic(List<RoadmapContentChild> children, String completedTopic) {
        for (RoadmapContentChild child : children) {
            if (child.getName().equals(completedTopic)) {
                return child.isCompletedTopic();
            }

            List<RoadmapContentChild> grandChildren = child.getChildren();
            if (grandChildren != null) {
                boolean found = searchCompletedTopic(grandChildren, completedTopic);
                if (found) {
                    return true;
                }
            }
        }
        return false;
    }

    private String signUpAndSignInUser(String userEmail) {
        String signUpURI = "http://localhost:%s/api/auth/signup".formatted(port);

        SignUpRequest signUpRequest = new SignUpRequest("Edward", userEmail, "Password1!", "USER");
        ResponseEntity<JwtAuthenticationResponse> signUpResponse = restTemplate.exchange(signUpURI, HttpMethod.POST, new HttpEntity<>(signUpRequest), JwtAuthenticationResponse.class);
        JwtAuthenticationResponse jwtAuthenticationResponse = signUpResponse.getBody();

        if (jwtAuthenticationResponse != null) {
            return jwtAuthenticationResponse.getToken();
        }
        return null;
    }

    private void createRoadmaps() {
        try {
            final String uri = BASE_URL.formatted(port);
            List<RoadmapDTO> testRoadmaps =
                    TestHelper.createRoadmapDTOs(Paths.get("src/test/resources/testJsons/roadmaps.json"));
            filterRoadmapMetaIds = testRoadmaps.stream().map(
                    testRoadmap -> {
                        ResponseEntity<RoadmapMeta> response =
                                restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(testRoadmap), RoadmapMeta.class);
                        return response.getBody().getId();
                    }
            ).toList();
        } catch (IOException e) {
            System.err.println("Failed to create test roadmaps");
        }
    }

    private void deleteRoadmaps() {
        filterRoadmapMetaIds.forEach(id -> {
            String uri = "http://localhost:%s/api/roadmaps/%s".formatted(port, id);
            ResponseEntity<Void> exchange = restTemplate.exchange(uri, HttpMethod.DELETE, HttpEntity.EMPTY, Void.class);
            assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        });
    }
}