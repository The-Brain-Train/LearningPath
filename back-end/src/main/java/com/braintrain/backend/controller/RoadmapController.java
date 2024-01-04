package com.braintrain.backend.controller;

import com.braintrain.backend.controller.dtos.*;
import com.braintrain.backend.exceptionHandler.exception.UserNotFoundException;
import com.braintrain.backend.model.*;
import com.braintrain.backend.service.RoadmapService;
import com.braintrain.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    @GetMapping
    public ResponseEntity<RoadmapMetaListDTO> getAllRoadmaps() {
        return ResponseEntity.ok(service.getAllRoadmapsMeta());
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<RoadmapMetaDTO>> getFilteredRoadmaps(
            @RequestParam(defaultValue = "") String name,
            @RequestParam(defaultValue = "") String experienceLevel,
            @RequestParam(defaultValue = "0") int fromHour,
            @RequestParam(defaultValue = "500") int toHour,
            @RequestParam(defaultValue = "latest") String sortedBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RoadmapMetaDTO> filteredRoadmapPage =
                service.getFilteredRoadmapsMetas(
                        name, experienceLevel,  fromHour, toHour, sortedBy, pageable);
        return ResponseEntity.ok(filteredRoadmapPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Roadmap> getRoadmap(@PathVariable String id) {
        return ResponseEntity.of(service.getRoadmapById(id));
    }

    @GetMapping("/findRoadmapByMeta/{metaId}")
    public ResponseEntity<Roadmap> findRoadmapByMetaId(@PathVariable String metaId) {
        return ResponseEntity.ok(service.findRoadmapByMetaId(metaId));
    }

    @GetMapping("/findRoadmapMeta/{metaId}/roadmapMeta")
    public ResponseEntity<RoadmapMeta> findRoadmapMeta(@PathVariable String metaId){
        return ResponseEntity.ok(service.getRoadmapMetaById(metaId));
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

    @GetMapping("/{userEmail}/count")
    public ResponseEntity<Long> getRoadmapCountOfUser(@PathVariable String userEmail) {
        Long roadmapCount = service.getRoadmapCountOfUser(userEmail);
        return ResponseEntity.ok(roadmapCount);
    }

    @GetMapping("/{userEmail}/votes")
    public ResponseEntity<UpVoteDownVoteDTO> getUserUpVoteDownVotes(@PathVariable String userEmail) {
        return ResponseEntity.ok(userService.getUserUpVoteDownVotes(userEmail));
    }

    @GetMapping("/{userEmail}/progress/{roadmapMetaId}")
    public ResponseEntity<Double> getRoadmapProgressOfUser(
            @PathVariable String userEmail,
            @PathVariable String roadmapMetaId) {

        if (userEmail == null) {
            throw new UserNotFoundException("User not found for email: " + userEmail);
        }

        Double progressPercentage = service.getRoadmapProgress(roadmapMetaId);
        return ResponseEntity.ok(progressPercentage);
    }

    @PostMapping
    public ResponseEntity<RoadmapMeta> createRoadmap(@RequestBody RoadmapDTO roadmapDTO){
        RoadmapMeta roadmapMeta = service.createRoadmap(roadmapDTO);
        URI uri = URI.create("/api/roadmaps" + roadmapMeta.getRoadmapReferenceId());
        return ResponseEntity.created(uri).body(roadmapMeta);
    }

    @PostMapping("/{userEmail}/upvote/{roadmapMetaId}")
    public ResponseEntity<Long> upVoteRoadmapMeta(@PathVariable String userEmail, @PathVariable String roadmapMetaId) {
        Long voteCount = service.upVoteRoadmapMeta(userEmail, roadmapMetaId);
        return ResponseEntity.ok(voteCount);
    }

    @PostMapping("/{userEmail}/downvote/{roadmapMetaId}")
    public ResponseEntity<Long> downVoteRoadmapMeta(@PathVariable String userEmail, @PathVariable String roadmapMetaId) {
        Long voteCount = service.downVoteRoadmapMeta(userEmail, roadmapMetaId);
        return ResponseEntity.ok(voteCount);
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

    @PostMapping("/{userEmail}/createRoadmapCopy/{roadmapMetaId}")
    public ResponseEntity<Roadmap> createRoadmapCopyForUser(@PathVariable String userEmail, @PathVariable String roadmapMetaId) {
        User user = userService.getUserByEmail(userEmail);

        if (user == null) {
            throw new UserNotFoundException("User not found for email: " + userEmail);
        }

        Roadmap copyOfRoadmap = service.createCopyOfRoadmap(userEmail, roadmapMetaId);
        return ResponseEntity.ok(copyOfRoadmap);
    }

    @PutMapping("/{userEmail}/completedTopic/{roadmapMetaId}")
    public ResponseEntity<Roadmap> updateCompletedTopicStatus(@RequestBody String completedTopic, @PathVariable String roadmapMetaId) {
        Roadmap updatedRoadmap = service.markTopicOfChildAsComplete(roadmapMetaId, completedTopic);
        return ResponseEntity.ok(updatedRoadmap);
    }

    @PutMapping("/{userEmail}/resource/{roadmapMetaId}")
    public ResponseEntity<Roadmap> addResourcesToRoadmap(
            @PathVariable String userEmail,
            @PathVariable String roadmapMetaId,
            @RequestBody ResourcesDTO resourcesDto) {

        if (userEmail == null) {
            throw new UserNotFoundException("User not found for email: " + userEmail);
        }

        Roadmap updatedRoadmap =
                service.addResourcesToRoadmap(roadmapMetaId, resourcesDto.resources());
        return ResponseEntity.ok(updatedRoadmap);
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoadmap(@PathVariable String id) {
        RoadmapMeta roadmapMeta = service.getRoadmapMetaById(id);
        service.removeRoadmapFromFavorites(roadmapMeta);
        service.delete(roadmapMeta);
        return ResponseEntity.noContent().build();
    }
}
