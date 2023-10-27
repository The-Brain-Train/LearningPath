package com.braintrain.backend.service;

import com.braintrain.backend.controller.dtos.RoadmapDTO;
import com.braintrain.backend.controller.dtos.RoadmapMetaListDTO;
import com.braintrain.backend.controller.dtos.UserFavoritesDTO;
import com.braintrain.backend.exceptionHandler.exception.RoadmapCountExceededException;
import com.braintrain.backend.model.*;
import com.braintrain.backend.repository.RoadmapMetaRepository;
import com.braintrain.backend.repository.RoadmapRepository;
import com.braintrain.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@AllArgsConstructor
public class RoadmapService {
    private final RoadmapMetaRepository metaRepo;
    private final RoadmapRepository repo;
    private final UserRepository userRepo;

    public RoadmapMeta createRoadmap(RoadmapDTO roadmapDTO) {
        validateDTONameInput(roadmapDTO.name(), "Invalid name");
        validateDTORoadmapInput(roadmapDTO.roadmap());
        validateRoadmapCount(roadmapDTO.userEmail());
        Roadmap roadmap = repo.save(new Roadmap(roadmapDTO.roadmap(), roadmapDTO.userEmail(), roadmapDTO.experienceLevel(), roadmapDTO.hours()));
        return metaRepo.save(new RoadmapMeta(roadmapDTO.name(), roadmap.getId(), roadmapDTO.userEmail(), roadmapDTO.experienceLevel(), roadmapDTO.hours()));
    }

    public RoadmapMetaListDTO getAllRoadmapsMeta() {
        return new RoadmapMetaListDTO(metaRepo.findAll());
    }

    public List<Roadmap> getAllRoadmaps() {
        return repo.findAll();
    }

    public Optional<Roadmap> getRoadmapById(String id) {
        return repo.findById(id);
    }

    public RoadmapMeta getRoadmapMetaById(String id) {
        return metaRepo.findById(id).orElse(null);
    }

    public void delete(RoadmapMeta roadmapMeta) {
        if(roadmapMeta == null) return;
        repo.deleteById(roadmapMeta.getRoadmapReferenceId());
        metaRepo.delete(roadmapMeta);
    }

    public void deleteRoadmapMeta(String id) {
        metaRepo.deleteById(id);
    }

    public UserFavoritesDTO addRoadmapMetaToFavorites(User user, RoadmapMeta roadmapMeta) {
        List<RoadmapMeta> favorites = user.getFavorites();

        if (!favorites.contains(roadmapMeta)) {
            favorites.add(roadmapMeta);
            user.setFavorites(favorites);
            userRepo.save(user);
        }

        return new UserFavoritesDTO(user.getFavorites());
    }

    public UserFavoritesDTO removeRoadmapMetaFromFavorites(User user, RoadmapMeta roadmapMeta) {
        List<RoadmapMeta> favorites = user.getFavorites();

        if (favorites.contains(roadmapMeta)) {
            favorites.remove(roadmapMeta);
            user.setFavorites(favorites);
            userRepo.save(user);
        }

        return new UserFavoritesDTO(user.getFavorites());
    }

    private static void validateDTONameInput(String roadmapDTOName, String Invalid_name) {
        if (roadmapDTOName == null || roadmapDTOName.isEmpty()) {
            throw new IllegalArgumentException(Invalid_name);
        }
    }

    private void validateDTORoadmapInput(String roadmapDTORoadmap) {
        if (roadmapDTORoadmap == null || roadmapDTORoadmap.isEmpty()) {
            throw new IllegalArgumentException("Roadmap null or empty");
        }

        if (!roadmapDTORoadmap.contains("\"name\":") ||
                !roadmapDTORoadmap.contains("\"value\":") ||
                !roadmapDTORoadmap.contains("\"children\":")) {
            throw new IllegalArgumentException("Roadmap has an invalid data structure");
        }
    }

    private void validateRoadmapCount(String userEmail) {
        Long roadmapCount = repo.countByUserEmail(userEmail);
        Long MAX_ROADMAP_COUNT = 10L;
        if (roadmapCount.equals(MAX_ROADMAP_COUNT)) {
            throw new RoadmapCountExceededException();
        }
    }
}
