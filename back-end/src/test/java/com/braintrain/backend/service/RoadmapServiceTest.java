package com.braintrain.backend.service;

import com.braintrain.backend.TestHelper;
import com.braintrain.backend.exceptionHandler.exception.RoadmapCountExceededException;
import com.braintrain.backend.model.Roadmap;
import com.braintrain.backend.controller.dtos.RoadmapDTO;
import com.braintrain.backend.model.RoadmapMeta;
import com.braintrain.backend.repository.RoadmapMetaRepository;
import com.braintrain.backend.repository.RoadmapRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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

    @Test
    void creating11thRoadmapShouldReturn400() throws IOException {
        Path path = Paths.get("src/test/resources/java.json");
        List<RoadmapMeta> createdRoadmaps = new ArrayList<>();
        // One created before test, so only 9 created in loop.
        try {
            for (int i = 0; i < 9; i++) {
                RoadmapDTO roadmapDTO = TestHelper.createRoadmapDTO("Java", path);
                RoadmapMeta createdRoadmap = roadmapService.createRoadmap(roadmapDTO);
                createdRoadmaps.add(createdRoadmap);
            }

            RoadmapDTO eleventhRoadmapDTO = TestHelper.createRoadmapDTO("Java", path);
            RoadmapMeta eleventhRoadmapMeta = roadmapService.createRoadmap(eleventhRoadmapDTO);
            createdRoadmaps.add(eleventhRoadmapMeta);

            Assertions.fail("Expected RoadmapCountExceededException was not thrown");
        } catch (RoadmapCountExceededException e) {
            assertThat(e.getMessage()).isEqualTo("Roadmap count exceeded. User is only allowed to create 10 roadmaps.");
        } finally {
            for (RoadmapMeta roadmapMeta : createdRoadmaps) {
                roadmapService.delete(roadmapMeta);
            }
        }
    }
}