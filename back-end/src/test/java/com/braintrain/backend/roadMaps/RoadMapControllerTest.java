package com.braintrain.backend.roadMaps;

import com.braintrain.backend.TestHelper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
class RoadMapControllerTest {
    @Value("${server.port}")
    private int port;

    @Autowired
    RestTemplate restTemplate;

    private static final String BASE_URL = "http://localhost:%s/api/roadmaps";

    ResponseEntity<RoadMapMeta> exchange;

    @BeforeEach
    public void setup() throws IOException {
        String uri = BASE_URL.formatted(port);
        RoadMapDTO dto = TestHelper.createRoadMapDTO("Java", Paths.get("src/test/resources/java.json"));
        exchange = restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(dto), RoadMapMeta.class);
    }

    @AfterEach
    public void tearDown() {
        if(exchange != null) {
            String uri = "http://localhost:%s/api/roadmaps/%s".formatted(port, exchange.getBody().getId());
            ResponseEntity<Void> exchange = restTemplate.exchange(uri, HttpMethod.DELETE, HttpEntity.EMPTY, Void.class);
            assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        }
    }

    @Test
    void shouldGetRoadMaps() {
        String uri = BASE_URL.formatted(port);
        ResponseEntity<List<RoadMapMeta>> exchange = restTemplate.exchange(uri, HttpMethod.GET, HttpEntity.EMPTY,
                new ParameterizedTypeReference<List<RoadMapMeta>>() {});
        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(exchange.hasBody()).isTrue();
    }

    @Test
    void shouldCreateRoadMap() throws IOException {
        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(exchange.getHeaders().getLocation()).isNotNull();
    }

    @Test
    void shouldGetRoadMap() {
        String uri = "http://localhost:%s/api/roadmaps/%s".formatted(port, exchange.getBody().getRoadMapReferenceId());
        ResponseEntity<RoadMap> response = restTemplate.exchange(uri, HttpMethod.GET, HttpEntity.EMPTY, RoadMap.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.hasBody()).isTrue();

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
    void shouldDeleteRoadMap() {
        String uri = "http://localhost:%s/api/roadmaps/%s".formatted(port, exchange.getBody().getId());
        ResponseEntity<Void> response = restTemplate.exchange(uri, HttpMethod.DELETE, HttpEntity.EMPTY, Void.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    void shouldReturn400WhenCreatingRoadMapWithEmptyName() throws IOException {
        String uri = BASE_URL.formatted(port);
        RoadMapDTO dto = TestHelper.createRoadMapDTO("", Paths.get("src/test/resources/java.json"));

        try {
            ResponseEntity<Void> exchange = restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(dto), Void.class);
            fail("should throw exception");
        } catch (HttpClientErrorException err) {
            assertThat(err.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        }
    }

    @Test
    void shouldReturn400WhenCreatingRoadMapWithEmptyRoadmap() {
        String uri = BASE_URL.formatted(port);
        RoadMapDTO dto = new RoadMapDTO("Java", "");

        try {
            ResponseEntity<Void> exchange = restTemplate.exchange(uri, HttpMethod.POST, new HttpEntity<>(dto), Void.class);
            fail("should throw exception");
        } catch (HttpClientErrorException err) {
            assertThat(err.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        }
    }
}