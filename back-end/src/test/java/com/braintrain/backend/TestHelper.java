package com.braintrain.backend;

import com.braintrain.backend.controller.dtos.RoadmapDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;

public class TestHelper {
    public static RoadmapDTO createRoadmapDTO(String name, Path path) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(new File(String.valueOf(path)));
        String str = objectMapper.writeValueAsString(jsonNode);
        return new RoadmapDTO(name, str, "123@gmail.com", "beginner", 10);
    }

    public static List<RoadmapDTO> createRoadmapDTOs(Path path) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        TypeReference<List<HashMap<String,String>>> typeRef = new TypeReference<>() {};
        List<HashMap<String,String>> records = objectMapper.readValue(path.toFile(), typeRef);

        return records.stream().map( m -> new RoadmapDTO(m.get("name"), m.get("obj"),
                m.get("userEmail"), m.get("experienceLevel"), Integer.parseInt(m.get("hours")))).toList();
    }

}
