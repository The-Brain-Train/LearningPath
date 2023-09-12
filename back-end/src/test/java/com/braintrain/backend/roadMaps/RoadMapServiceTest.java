package com.braintrain.backend.roadMaps;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
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
        List<RoadMapMeta> roadmapMetaList = roadMapService.getAll();

        assertThat(roadmapMetaList.size()).isEqualTo(4);
    }


    @Test
    void deleteRoadMapMeta() {
        RoadMapMeta createdRoadMap = roadMapService.createRoadMapMeta(new RoadMapMeta("brain-train"));
        roadMapService.deleteRoadMapMeta(createdRoadMap.getId());

        List<RoadMapMeta> roadmapMetaList = roadMapService.getAll();

        Assertions.assertFalse(roadmapMetaList.contains(createdRoadMap));
    }

    @Test
    void createRoadMap(){
        RoadMap roadMap = new RoadMap();
        RoadMap newRoadMap = roadMapService.createRoadMap(roadMap);

        assertThat(newRoadMap).isNotNull();
    }

    @Test
    void createRoadMapMeta() {
        RoadMapMeta roadMap = new RoadMapMeta("Book writing");
        int roadmapMetaListSize = roadMapService.getAll().size();

        roadMapService.createRoadMapMeta(roadMap);

        int roadmapMetaSizeAfterCreation = roadMapService.getAll().size();

        assertThat(roadmapMetaListSize + 1).isEqualTo(roadmapMetaSizeAfterCreation);

        roadMapService.deleteRoadMapMeta(roadMap.getId());
    }
}