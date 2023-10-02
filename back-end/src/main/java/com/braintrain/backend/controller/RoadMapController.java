package com.braintrain.backend.controller;


import com.braintrain.backend.exceptionHandler.UserNotFoundException;
import com.braintrain.backend.model.*;
import com.braintrain.backend.service.RoadMapService;
import com.braintrain.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/roadmaps")
@CrossOrigin
@AllArgsConstructor
public class RoadMapController {
    private final RoadMapService service;

    private final UserService userService;

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

    @GetMapping("/{userEmail}/roadMapMetas")
    public ResponseEntity<RoadMapMetaListDTO> getUserRoadmapMetas(@PathVariable String userEmail) {
        User user = userService.getUserByEmail(userEmail);

        if (user == null) {
            throw new UserNotFoundException("User not found for email: " + userEmail);
        }

        RoadMapMetaListDTO roadMapMetaListDTO = service.getAllRoadMapsMeta();

        List<RoadMapMeta> filteredMetaList = roadMapMetaListDTO.roadMapMetaList().stream()
                .filter(meta -> userEmail.equals(meta.getUserEmail()))
                .toList();

        return ResponseEntity.ok(new RoadMapMetaListDTO(filteredMetaList));
    }

    @PostMapping("/{userEmail}/favorites")
    public ResponseEntity<UserFavoritesDTO> addRoadmapMetaToFavorites(@PathVariable String userEmail, @RequestBody RoadMapMeta roadMapMeta) {
        User user = userService.getUserByEmail(userEmail);

        if (user == null) {
            throw new UserNotFoundException("User not found for email: " + userEmail);
        }

        UserFavoritesDTO userFavorites = service.addRoadmapToFavorites(user, roadMapMeta);

        URI uri = URI.create("/api/roadmaps" + user.getEmail() + "/favorites" + roadMapMeta.getRoadMapReferenceId());
        return ResponseEntity.created(uri).body(userFavorites);
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
