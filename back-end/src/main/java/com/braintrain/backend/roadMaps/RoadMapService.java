package com.braintrain.backend.roadMaps;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@AllArgsConstructor
public class RoadMapService {
    private final RoadMapMetaRepository metaRepo;
    private final RoadMapRepository repo;

    public RoadMapMeta createRoadMap(RoadMapDTO roadMapDTO) {
        RoadMap roadMap = repo.save(new RoadMap(roadMapDTO.roadMap()));
        return metaRepo.save(new RoadMapMeta(roadMapDTO.name(), roadMap.getId()));
    }

    public List<RoadMapMeta> getAllRoadMapsMeta() {
        return metaRepo.findAll();
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
}
