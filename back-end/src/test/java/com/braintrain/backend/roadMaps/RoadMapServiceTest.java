package com.braintrain.backend.roadMaps;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class RoadMapServiceTest {

    @Autowired
    RoadMapService roadMapService;



    @Test
    void getAllRoadmapMetas() {

        RoadMapMeta roadMap = new RoadMapMeta("Java");

        roadMapService.createRoadMapMeta(roadMap);

        List<RoadMapMeta> roadmapMetaList = roadMapService.getAll();



        assertThat(roadmapMetaList).isNotNull();
    }

    @Test
    void createRoadMapMeta() {
    }
}