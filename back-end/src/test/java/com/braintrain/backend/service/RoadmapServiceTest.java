package com.braintrain.backend.service;

import com.braintrain.backend.TestHelper;
import com.braintrain.backend.model.Roadmap;
import com.braintrain.backend.controller.dtos.RoadmapDTO;
import com.braintrain.backend.model.RoadmapMeta;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
class RoadmapServiceTest {

    @Autowired
    RoadmapService roadmapService;
    RoadmapMeta roadmapMeta;
    @BeforeEach
    public void setup() throws IOException {
        RoadmapDTO dto = TestHelper.createRoadmapDTO("Java", Paths.get("src/test/resources/java.json"));
        roadmapMeta = roadmapService.createRoadmap(dto);
    }

    @AfterEach
    public void tearDown() {
        if(roadmapMeta != null) {
            roadmapService.delete(roadmapMeta);
        }
    }

    @Test
    void roadmapsShouldBeMoreThan0() {
        List<Roadmap> roadmapList = roadmapService.getAllRoadmaps();
        assertThat(roadmapList.size()).isGreaterThan(0);
    }

    @Test
    void canCreateRoadmap() {
        assertThat(roadmapMeta).isNotNull();
    }

    @Test
    void canDeleteRoadmap() {
        roadmapService.deleteRoadmapMeta(roadmapMeta.getId());
        assertNull(roadmapService.getRoadmapMetaById(roadmapMeta.getId()));
    }

    @Test
    void onDeleteRemoveBothRoadmapAndRoadmapMeta() {
        roadmapService.delete(roadmapMeta);

        assertNull(roadmapService.getRoadmapMetaById(roadmapMeta.getId()));
        assertNull(roadmapService.getRoadmapById(roadmapMeta.getRoadmapReferenceId()).orElse(null));
    }
}