package com.braintrain.backend.roadMaps;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roadmaps")
@CrossOrigin(origins = "*")
public class RoadMapController {

    @Autowired
    private RoadMapService service;

    @GetMapping
    public ResponseEntity<List<RoadMapMeta>> getRoadMap() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<RoadMapMeta> createRoadMap(@RequestBody RoadMapMeta roadMapMeta){
        return ResponseEntity.ok(service.createRoadMapMeta(roadMapMeta));
    }


}
