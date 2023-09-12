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

    public RoadMap createRoadMap(RoadMap roadMap) {
        return repo.save(roadMap);}

    public List<RoadMapMeta> getAllRoadMapsMeta() {
        return metaRepo.findAll();
    }

    public List<RoadMap> getAllRoadMaps() {
        return repo.findAll();
    }

    public RoadMapMeta createRoadMapMeta(RoadMapMeta roadMapMeta) {
        return metaRepo.save(roadMapMeta);
    }

    public void deleteRoadMapMeta(String id) {
        metaRepo.deleteById(id);
    }
}
