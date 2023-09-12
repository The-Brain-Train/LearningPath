package com.braintrain.backend.roadMaps;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
class RoadMapServiceTest {

    @Autowired
    RoadMapService roadMapService;

    RoadMapMeta roadMapMeta;
    @BeforeEach
    public void setup() throws IOException {
        Path path = Paths.get("src/test/resources/java.json");
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(new File(String.valueOf(path)));
        String str = objectMapper.writeValueAsString(jsonNode);
        RoadMap roadMap = new RoadMap(str);
        roadMapMeta = roadMapService.createRoadMap(new RoadMapDTO("Java", str));
    }

    @AfterEach
    public void tearDown() {
        if(roadMapMeta != null) {
            roadMapService.deleteRoadMapMeta(roadMapMeta.getId());
        }
    }

    @Test
    void roadmapsShouldBeMoreThan0() {
        List<RoadMap> roadmapList = roadMapService.getAllRoadMaps();
        assertThat(roadmapList.size()).isGreaterThan(0);
    }

    @Test
    void canCreateRoadmap() {
        assertThat(roadMapMeta).isNotNull();
    }

    @Test
    void canDeleteRoadMap() {
        roadMapService.deleteRoadMapMeta(roadMapMeta.getId());
        assertNull(roadMapService.getRoadMapMetaById(roadMapMeta.getId()));
    }

    @Test
    void onDeleteRemoveBothRoadMapAndRoadMapMeta() {
        roadMapService.delete(roadMapMeta);

        assertNull(roadMapService.getRoadMapMetaById(roadMapMeta.getId()));
        assertNull(roadMapService.getRoadMapById(roadMapMeta.getRoadMapReferenceId()));
    }


}