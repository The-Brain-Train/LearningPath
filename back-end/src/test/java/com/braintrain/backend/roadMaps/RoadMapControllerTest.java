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

    private static String BASE_URL = "http://localhost:%s/api/roadmaps";

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
    void getRoadMaps() {
        String uri = BASE_URL.formatted(port);
        ResponseEntity<List<RoadMapMeta>> exchange = restTemplate.exchange(uri, HttpMethod.GET, HttpEntity.EMPTY,
                new ParameterizedTypeReference<List<RoadMapMeta>>() {});
        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(exchange.hasBody()).isTrue();
    }

    @Test
    void createRoadMap() throws IOException {
        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(exchange.getHeaders().getLocation()).isNotNull();
    }

    @Test
    void getRoadMap() {
        String uri = "http://localhost:%s/api/roadmaps/%s".formatted(port, exchange.getBody().getRoadMapReferenceId());
        ResponseEntity<RoadMap> exchange = restTemplate.exchange(uri, HttpMethod.GET, HttpEntity.EMPTY, RoadMap.class);
        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(exchange.hasBody()).isTrue();

    }

    @Test
    void deleteRoadMap() {
        String uri = "http://localhost:%s/api/roadmaps/%s".formatted(port, exchange.getBody().getId());
        ResponseEntity<Void> exchange = restTemplate.exchange(uri, HttpMethod.DELETE, HttpEntity.EMPTY, Void.class);
        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }
}