package com.braintrain.backend.controller;


import com.braintrain.backend.controller.dtos.RoadmapDTO;
import com.braintrain.backend.controller.dtos.RoadmapMetaListDTO;
import com.braintrain.backend.controller.dtos.UserFavoritesDTO;
import com.braintrain.backend.exceptionHandler.UserNotFoundException;
import com.braintrain.backend.model.*;
import com.braintrain.backend.service.RoadmapService;
import com.braintrain.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("api/roadmaps")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class RoadmapController {
    private final RoadmapService service;

    private final UserService userService;

    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok().body("Server is up and running!");
    }

    @GetMapping
    public ResponseEntity<RoadmapMetaListDTO> getRoadmap() {
        return ResponseEntity.ok(service.getAllRoadmapsMeta());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Roadmap> getRoadmap(@PathVariable String id) {
        return ResponseEntity.of(service.getRoadmapById(id));
    }

    @GetMapping("/{userEmail}/roadmapMetas")
    public ResponseEntity<RoadmapMetaListDTO> getUserRoadmapMetas(@PathVariable String userEmail) {
        User user = userService.getUserByEmail(userEmail);

        if (user == null) {
            throw new UserNotFoundException("User not found for email: " + userEmail);
        }

        RoadmapMetaListDTO roadmapMetaListDTO = service.getAllRoadmapsMeta();

        List<RoadmapMeta> filteredMetaList = roadmapMetaListDTO.roadmapMetaList().stream()
                .filter(meta -> userEmail.equals(meta.getUserEmail()))
                .toList();

        return ResponseEntity.ok(new RoadmapMetaListDTO(filteredMetaList));
    }

    @GetMapping("/{userEmail}/favorites")
    public ResponseEntity<UserFavoritesDTO> getUsersFavorites(@PathVariable String userEmail){
        User user = userService.getUserByEmail(userEmail);
        return ResponseEntity.ok(userService.getUsersFavorites(user));
    }

    @PostMapping("/{userEmail}/favorites")
    public ResponseEntity<UserFavoritesDTO> addRoadmapMetaToFavorites(@PathVariable String userEmail, @RequestBody RoadmapMeta roadmapMeta) {
        User user = userService.getUserByEmail(userEmail);

        if (user == null) {
            throw new UserNotFoundException("User not found for email: " + userEmail);
        }

        UserFavoritesDTO userFavorites = service.addRoadmapMetaToFavorites(user, roadmapMeta);

        URI uri = URI.create("/api/roadmaps/" + user.getEmail() + "/favorites/" + roadmapMeta.getRoadmapReferenceId());
        return ResponseEntity.created(uri).body(userFavorites);
    }

    @DeleteMapping("/{userEmail}/favorites")
    public ResponseEntity<UserFavoritesDTO> removeRoadmapMetaFromFavorites(@PathVariable String userEmail, @RequestBody RoadmapMeta roadmapMeta) {
        User user = userService.getUserByEmail(userEmail);

        if (user == null) {
            throw new UserNotFoundException("User not found for email: " + userEmail);
        }

        UserFavoritesDTO userFavorites = service.removeRoadmapMetaFromFavorites(user, roadmapMeta);

        return ResponseEntity.ok(userFavorites);
    }

    @PostMapping
    public ResponseEntity<RoadmapMeta> createRoadmap(@RequestBody RoadmapDTO roadmapDTO){
        RoadmapMeta roadmapMeta = service.createRoadmap(roadmapDTO);
        URI uri = URI.create("/api/roadmaps" + roadmapMeta.getRoadmapReferenceId());
        return ResponseEntity.created(uri).body(roadmapMeta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoadmap(@PathVariable String id) {
        RoadmapMeta roadmapMeta = service.getRoadmapMetaById(id);
        service.delete(roadmapMeta);
        return ResponseEntity.noContent().build();
    }
}
