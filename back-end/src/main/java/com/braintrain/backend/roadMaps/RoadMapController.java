package com.braintrain.backend.roadMaps;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

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
        RoadMap roadMap = service.getRoadMapById(id);
        return ResponseEntity.ok(roadMap);
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
