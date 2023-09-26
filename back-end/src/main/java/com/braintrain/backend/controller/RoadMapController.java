package com.braintrain.backend.controller;


import com.braintrain.backend.model.RoadMap;
import com.braintrain.backend.model.RoadMapDTO;
import com.braintrain.backend.model.RoadMapMeta;
import com.braintrain.backend.model.RoadMapMetaListDTO;
import com.braintrain.backend.service.RoadMapService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("api/roadmaps")
@CrossOrigin
@AllArgsConstructor
public class RoadMapController {
    private final RoadMapService service;

    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok().body("Server is up and running!");
    }

    @GetMapping
    public ResponseEntity<RoadMapMetaListDTO> getRoadMap() {
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
