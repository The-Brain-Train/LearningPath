package com.braintrain.backend.roadMaps;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class RoadMapServiceTest {

    @Autowired
    private final RoadMapService roadMapService;

    RoadMapServiceTest(RoadMapService roadMapService) {
        this.roadMapService = roadMapService;
    }

    @Test
    void getAll() {
    }

    @Test
    void createRoadMapMeta() {
    }
}