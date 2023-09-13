package com.braintrain.backend;

import com.braintrain.backend.roadMaps.RoadMapDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;

public class TestHelper {
    public static RoadMapDTO createRoadMapDTO(String name, Path path) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(new File(String.valueOf(path)));
        String str = objectMapper.writeValueAsString(jsonNode);
        return new RoadMapDTO(name, str);
    }
}
