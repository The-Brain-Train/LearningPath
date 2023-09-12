package com.braintrain.backend.roadMaps;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class RoadMapService {

    @Autowired
    RoadMapMetaRepository metaRepo;

    @Autowired
    RoadMapRepository repo;

    public RoadMapMeta createRoadMap(RoadMapDTO roadMapDTO) {

        RoadMap roadMap = repo.save(new RoadMap(roadMapDTO.roadMap()));
        RoadMapMeta roadMapMeta = metaRepo.save(new RoadMapMeta(roadMapDTO.name(), roadMap.getId()));

        return roadMapMeta;

    }

    public List<RoadMapMeta> getAllRoadMapsMeta() {
        return metaRepo.findAll();
    }

    public List<RoadMap> getAllRoadMaps() {
        return repo.findAll();
    }

    public RoadMap getRoadMapById(String id) {
        return repo.findById(id).orElse(null);
    }

    public RoadMapMeta getRoadMapMetaById(String id) {
        return metaRepo.findById(id).orElse(null);
    }

    public RoadMapMeta createRoadMapMeta(RoadMapMeta roadMapMeta) {
        return metaRepo.save(roadMapMeta);
    }

    public void deleteRoadMapMeta(String id) {
        metaRepo.deleteById(id);
    }
}
