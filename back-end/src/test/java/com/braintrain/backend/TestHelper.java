package com.braintrain.backend;

import com.braintrain.backend.model.RoadmapDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;

public class TestHelper {
    public static RoadmapDTO createRoadmapDTO(String name, Path path) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(new File(String.valueOf(path)));
        String str = objectMapper.writeValueAsString(jsonNode);
        return new RoadmapDTO(name, str, "edwardsemail@gmail.com", "Beginner", 10);
    }
}
