package com.braintrain.backend.service;

import com.braintrain.backend.controller.dtos.*;
import com.braintrain.backend.exceptionHandler.exception.RoadmapCountExceededException;
import com.braintrain.backend.exceptionHandler.exception.RoadmapNotFoundException;
import com.braintrain.backend.model.*;
import com.braintrain.backend.repository.RoadmapMetaRepository;
import com.braintrain.backend.repository.RoadmapRepository;
import com.braintrain.backend.repository.UserRepository;
import com.braintrain.backend.util.RoadmapMetaConverter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class RoadmapService {
    private final RoadmapMetaRepository metaRepo;
    private final RoadmapRepository repo;
    private final UserRepository userRepo;
    private final UserService userService;
    private ObjectMapper objectMapper;

    public RoadmapMeta createRoadmap(RoadmapDTO roadmapDTO) {
        validateDTONameInput(roadmapDTO.name());
        validateDTORoadmapInput(roadmapDTO.roadmap());
        validateRoadmapCount(roadmapDTO.userEmail());
        Roadmap roadmap = repo.save(new Roadmap(roadmapDTO.roadmap(), roadmapDTO.userEmail(), roadmapDTO.experienceLevel(), roadmapDTO.hours()));
        return metaRepo.save(new RoadmapMeta(roadmapDTO.name(), roadmap.getId(), roadmapDTO.userEmail(), roadmapDTO.experienceLevel(), roadmapDTO.hours()));
    }

    public RoadmapMetaListDTO getAllRoadmapsMeta() {
        return new RoadmapMetaListDTO(metaRepo.findAll());
    }

    public Page<RoadmapMetaDTO> getFilteredRoadmapsMetas(
            String name, String experienceLevel,
            int fromHour, int toHour, Pageable pageable) {
        Page<RoadmapMeta> filteredPagedRoadmaps =
                metaRepo.findAllFilteredPaged(name, experienceLevel,
                        fromHour, toHour, pageable);
        return RoadmapMetaConverter.toRoadmapMetaDtoList(filteredPagedRoadmaps);
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

    public Roadmap findRoadmapByMetaId(String metaId) {
        RoadmapMeta roadmapMeta = getRoadmapMetaById(metaId);
        Optional<Roadmap> roadmap = getRoadmapById(roadmapMeta.getRoadmapReferenceId());
        if (roadmap.isEmpty()) {
            throw new RoadmapNotFoundException(metaId);
        }
        return  roadmap.get();
    }

    public Long getRoadmapCountOfUser(String userEmail) {
        return repo.countByUserEmail(userEmail);
    }

    public void delete(RoadmapMeta roadmapMeta) {
        if(roadmapMeta == null) return;
        repo.deleteById(roadmapMeta.getRoadmapReferenceId());
        metaRepo.delete(roadmapMeta);
    }

    public void deleteRoadmapMeta(String id) {
        metaRepo.deleteById(id);
    }

    public Long upVoteRoadmapMeta(String userEmail, String roadmapMetaId) {
        User user = userService.getUserByEmail(userEmail);
        RoadmapMeta roadmapMeta = getRoadmapMetaById(roadmapMetaId);
        validateUpVoteDownVoteLists(user);
        if (user.getUpVotes().contains(roadmapMeta)) {
            user.getUpVotes().remove(roadmapMeta);
            roadmapMeta.setUpVotes(roadmapMeta.getUpVotes() - 1);
        } else {
            if (user.getDownVotes().contains(roadmapMeta)) {
                user.getDownVotes().remove(roadmapMeta);
                roadmapMeta.setDownVotes(roadmapMeta.getDownVotes() - 1);
            }
            user.getUpVotes().add(roadmapMeta);
            roadmapMeta.setUpVotes(roadmapMeta.getUpVotes() + 1);
        }
        userRepo.save(user);
        metaRepo.save(roadmapMeta);
        return roadmapMeta.getUpVotes();
    }

    public Long downVoteRoadmapMeta(String userEmail, String roadmapMetaId) {
        User user = userService.getUserByEmail(userEmail);
        RoadmapMeta roadmapMeta = getRoadmapMetaById(roadmapMetaId);
        validateUpVoteDownVoteLists(user);
        if (user.getDownVotes().contains(roadmapMeta)) {
            user.getDownVotes().remove(roadmapMeta);
            roadmapMeta.setDownVotes(roadmapMeta.getDownVotes() - 1);
        } else {
            if (user.getUpVotes().contains(roadmapMeta)) {
                user.getUpVotes().remove(roadmapMeta);
                roadmapMeta.setUpVotes(roadmapMeta.getUpVotes() - 1);
            }
            user.getDownVotes().add(roadmapMeta);
            roadmapMeta.setDownVotes(roadmapMeta.getDownVotes() + 1);
        }
        userRepo.save(user);
        metaRepo.save(roadmapMeta);
        return roadmapMeta.getDownVotes();
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

    public Roadmap addResourcesToRoadmap(String roadmapMetaId, List<Resource> resources) {
        Roadmap roadmap = findRoadmapByMetaId(roadmapMetaId);
        try {
            RoadmapContent roadmapContent = objectMapper.readValue(roadmap.getObj(), RoadmapContent.class);
            roadmapContent.setResources(resources);
            String content = objectMapper.writeValueAsString(roadmapContent);
            roadmap.setObj(content);
            repo.save(roadmap);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return roadmap;
    }

    public void markChildElementAsComplete(String roadmapId, String childElementName) {
        Roadmap roadmap = findRoadmapByMetaId(roadmapId);
        RoadmapContent roadmapContent = null;
        try {
            roadmapContent = objectMapper.readValue(roadmap.getObj(), RoadmapContent.class);
            updateChildCompletionStatus(roadmapContent, childElementName, true);
            String content = objectMapper.writeValueAsString(roadmapContent);
            roadmap.setObj(content);
            repo.save(roadmap);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private void updateChildCompletionStatus(RoadmapContent roadmapContent, String childElementName, boolean completionStatus) {
        for (RoadmapContentChild child : roadmapContent.getChildren()) {
            if (child.getName().equals(childElementName)) {
                child.setCompletedTopic(completionStatus);
                updateParentCompletionStatus(roadmapContent, child);
                return;
            }
        }
    }

    private void updateParentCompletionStatus(RoadmapContent roadmapContent, RoadmapContentChild child) {
        boolean allChildrenCompleted = roadmapContent.getChildren().stream()
                .allMatch(RoadmapContentChild::isCompletedTopic);
        roadmapContent.setCompletedTopic(allChildrenCompleted);
    }

    private static void validateDTONameInput(String roadmapDTOName) {
        if (roadmapDTOName == null || roadmapDTOName.isEmpty()) {
            throw new IllegalArgumentException("Invalid name");
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

    private void validateUpVoteDownVoteLists(User user) {
        if (user.getUpVotes() == null) {
            user.setUpVotes(new ArrayList<>());
        }
        if (user.getDownVotes() == null) {
            user.setDownVotes(new ArrayList<>());
        }
    }
}
