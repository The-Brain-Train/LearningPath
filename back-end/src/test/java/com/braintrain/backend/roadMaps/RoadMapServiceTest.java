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

//    //@BeforeAll
//    //static void setup() {
//        RoadMapMeta roadMap = new RoadMapMeta("Java");
//
//    }

    @Test
    void getAllRoadmapMetas() {
//        RoadMapMeta roadMap = new RoadMapMeta("Java");

//        roadMapService.createRoadMapMeta(roadMap);

        List<RoadMapMeta> roadmapMetaList = roadMapService.getAll();

        assertThat(roadmapMetaList.size()).isEqualTo(4);
    }


    @Test
    void deleteRoadMapMeta() {
        RoadMapMeta roadMap = new RoadMapMeta("brain-train");
        roadMapService.createRoadMapMeta(roadMap);

        roadMapService.deleteRoadMapMeta(roadMap.getId());

        List<RoadMapMeta> roadmapMetaList = roadMapService.getAll();

        Assertions.assertFalse(roadmapMetaList.contains(roadMap));
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