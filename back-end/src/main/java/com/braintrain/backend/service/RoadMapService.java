package com.braintrain.backend.service;

import com.braintrain.backend.model.*;
import com.braintrain.backend.repository.RoadMapMetaRepository;
import com.braintrain.backend.repository.RoadMapRepository;
import com.braintrain.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@AllArgsConstructor
public class RoadMapService {
    private final RoadMapMetaRepository metaRepo;
    private final RoadMapRepository repo;

    private final UserRepository userRepo;

    public RoadMapMeta createRoadMap(RoadMapDTO roadMapDTO) {
        validateDTONameInput(roadMapDTO.name(), "Invalid name");
        validateDTORoadmapInput(roadMapDTO.roadMap());
        RoadMap roadMap = repo.save(new RoadMap(roadMapDTO.roadMap(), roadMapDTO.userEmail(), roadMapDTO.experienceLevel(), roadMapDTO.hours()));
        return metaRepo.save(new RoadMapMeta(roadMapDTO.name(), roadMap.getId(), roadMapDTO.userEmail(), roadMapDTO.experienceLevel(), roadMapDTO.hours()));
    }

    public RoadMapMetaListDTO getAllRoadMapsMeta() {
        return new RoadMapMetaListDTO(metaRepo.findAll());
    }

    public List<RoadMap> getAllRoadMaps() {
        return repo.findAll();
    }

    public Optional<RoadMap> getRoadMapById(String id) {
        return repo.findById(id);
    }

    public RoadMapMeta getRoadMapMetaById(String id) {
        return metaRepo.findById(id).orElse(null);
    }

    public void delete(RoadMapMeta roadMapMeta) {
        if(roadMapMeta == null) return;
        repo.deleteById(roadMapMeta.getRoadMapReferenceId());
        metaRepo.delete(roadMapMeta);
    }

    public void deleteRoadMapMeta(String id) {
        metaRepo.deleteById(id);
    }

    private static void validateDTONameInput(String roadMapDTOName, String Invalid_name) {
        if (roadMapDTOName == null || roadMapDTOName.isEmpty()) {
            throw new IllegalArgumentException(Invalid_name);
        }
    }

    private void validateDTORoadmapInput(String roadMapDTORoadMap) {
        if (roadMapDTORoadMap == null || roadMapDTORoadMap.isEmpty()) {
            throw new IllegalArgumentException("Roadmap null or empty");
        }

        if (!roadMapDTORoadMap.contains("\"name\":") ||
                !roadMapDTORoadMap.contains("\"value\":") ||
                !roadMapDTORoadMap.contains("\"children\":")) {
            throw new IllegalArgumentException("Roadmap has an invalid data structure");
        }
    }

    public UserFavoritesDTO addRoadmapToFavorites(User user, RoadMapMeta roadMapMeta) {
        List<RoadMapMeta> favorites = user.getFavorites();

        if (!favorites.contains(roadMapMeta)) {
            favorites.add(roadMapMeta);
            user.setFavorites(favorites);
            userRepo.save(user);
        }

        return new UserFavoritesDTO(user.getFavorites());
    }
}
