package com.braintrain.backend.roadMaps;

import com.braintrain.backend.TestHelper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.io.IOException;
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
        RoadMapDTO dto = TestHelper.createRoadMapDTO("Java", Paths.get("src/test/resources/java.json"));
        roadMapMeta = roadMapService.createRoadMap(dto);
    }

    @AfterEach
    public void tearDown() {
        if(roadMapMeta != null) {
            roadMapService.delete(roadMapMeta);
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
        assertNull(roadMapService.getRoadMapById(roadMapMeta.getRoadMapReferenceId()).orElse(null));
    }


}