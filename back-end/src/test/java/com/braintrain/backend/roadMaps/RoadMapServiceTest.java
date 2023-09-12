package com.braintrain.backend.roadMaps;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class RoadMapServiceTest {

    @Autowired
    RoadMapService roadMapService;

//    @Test
//    void getAllRoadmapMetas() {
//        List<RoadMapMeta> roadmapMetaList = roadMapService.getAllRoadMapsMeta();
//
//        assertThat(roadmapMetaList.size()).isEqualTo(4);
//    }
//
//    @Test
//    void getAllRoadmaps() {
//        List<RoadMap> roadmapList = roadMapService.getAllRoadMaps();
//
//        assertThat(roadmapList.size()).isEqualTo(1);
//    }
//
//
//    @Test
//    void deleteRoadMapMeta() {
//        RoadMapMeta createdRoadMap = roadMapService.createRoadMapMeta(new RoadMapMeta("brain-train"));
//        roadMapService.deleteRoadMapMeta(createdRoadMap.getId());
//
//        List<RoadMapMeta> roadmapMetaList = roadMapService.getAllRoadMapsMeta();
//
//        Assertions.assertFalse(roadmapMetaList.contains(createdRoadMap));
//    }
//
//    @Test
//    void createRoadMapMeta() {
//        RoadMapMeta roadMap = new RoadMapMeta("Book writing");
//        int roadmapMetaListSize = roadMapService.getAllRoadMapsMeta().size();
//
//        roadMapService.createRoadMapMeta(roadMap);
//
//        int roadmapMetaSizeAfterCreation = roadMapService.getAllRoadMapsMeta().size();
//
//        assertThat(roadmapMetaListSize + 1).isEqualTo(roadmapMetaSizeAfterCreation);
//
//        roadMapService.deleteRoadMapMeta(roadMap.getId());
//    }

    @Test
    void createRoadMap() throws IOException {
        Path path = Paths.get("src/test/resources/java.json");
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(new File(String.valueOf(path)));
        String str = objectMapper.writeValueAsString(jsonNode);

        RoadMap roadMap = new RoadMap(str);
        RoadMapMeta newRoadMap = roadMapService.createRoadMap(new RoadMapDTO("Java", str));

        assertThat(newRoadMap).isNotNull();
    }
}