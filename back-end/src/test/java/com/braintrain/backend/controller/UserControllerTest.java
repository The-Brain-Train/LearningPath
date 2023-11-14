package com.braintrain.backend.controller;

import com.braintrain.backend.model.User;
import com.braintrain.backend.security.dao.JwtAuthenticationResponse;
import com.braintrain.backend.security.dao.SignInRequest;
import com.braintrain.backend.security.dao.SignUpRequest;
import com.braintrain.backend.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.fail;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
@AutoConfigureMockMvc
class UserControllerTest {
    @Value("${server.port}")
    private int port;
    @Autowired
    RestTemplate restTemplate;
    private static final String PROFILE_IMAGE_BASE_URL = "http://localhost:%s/api/users/%s/profileImage";
    private static String authToken;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    UserService userService;

    @BeforeEach
    public void setUp() {
        authToken = signUpAndSignInUser();
    }

    @AfterEach
    public void afterEach() {
        User user = userService.getUserByEmail("edwardsemail@gmail.com");
        if (user != null) {
            userService.deleteUser(user);
        }
    }

    @Test
    void shouldUpdateProfilePicture() throws IOException {
        String userEmail = "edwardsemail@gmail.com";
        String uri = PROFILE_IMAGE_BASE_URL.formatted(port, userEmail);
        String profilePictureName = "cool-profile-pictures-63a5e8ee8cdcfab2f952bcd46a73e5c4.jpg";

        MultiValueMap<String, Object> parts = createMultipartRequest(profilePictureName);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + authToken);

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(parts, headers);

        ResponseEntity<String> exchange = restTemplate.exchange(uri, HttpMethod.POST, entity, String.class);

        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(exchange.getBody()).isNotEmpty();
    }

    @Test
    void uploadingInvalidImageContentTypeShouldThrow422() throws IOException {
        String userEmail = "edwardsemail@gmail.com";
        String profilePictureName = "test-pdf-file.pdf";
        String uri = PROFILE_IMAGE_BASE_URL.formatted(port, userEmail);

        MultiValueMap<String, Object> parts = createMultipartRequest(profilePictureName);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + authToken);

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(parts, headers);

        try {
            restTemplate.exchange(uri, HttpMethod.POST, entity, Void.class);
            fail("should throw exception");
        } catch (HttpClientErrorException err) {
            assertThat(err.getStatusCode()).isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    @Test
    void shouldGetProfilePicture() {
        String userEmail = "edwardsemail@gmail.com";
        String uri = PROFILE_IMAGE_BASE_URL.formatted(port, userEmail);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + authToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> exchange = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);

        assertThat(exchange.getStatusCode()).isEqualTo(HttpStatus.OK);
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

    private MultiValueMap<String, Object> createMultipartRequest(String fileName) throws IOException {
        ClassPathResource classPathResource = new ClassPathResource(fileName);
        Path path = Paths.get(classPathResource.getURI());
        byte[] content = Files.readAllBytes(path);

        MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
        parts.add("file", new ByteArrayResource(content) {
            @Override
            public String getFilename() {
                return fileName;
            }
        });
        return parts;
    }
}