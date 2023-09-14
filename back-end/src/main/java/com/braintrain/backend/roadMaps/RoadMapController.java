package com.braintrain.backend.roadMaps;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/roadmaps")
@CrossOrigin(origins = "*")
public class RoadMapController {

    @Autowired
    private RoadMapService service;

    @GetMapping
    public ResponseEntity<List<RoadMapMeta>> getRoadMap() {
        return ResponseEntity.ok(service.getAllRoadMapsMeta());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoadMap> getRoadMap(@PathVariable String id) {
        return ResponseEntity.of(service.getRoadMapById(id));
    }

    @PostMapping
    public ResponseEntity<RoadMapMeta> createRoadMap(@RequestBody RoadMapDTO roadMapDTO){
        RoadMapMeta roadMapMeta = service.createRoadMap(roadMapDTO);
        URI uri = URI.create("/api/roadmaps" + roadMapMeta.getRoadMapReferenceId());
        return ResponseEntity.created(uri).body(roadMapMeta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoadMap(@PathVariable String id) {
        RoadMapMeta roadMapMeta = service.getRoadMapMetaById(id);
        service.delete(roadMapMeta);
        return ResponseEntity.noContent().build();
    }
}
