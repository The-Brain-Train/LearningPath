package com.braintrain.backend.roadMaps;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class RoadMapService {

    @Autowired
    RoadMapRepository repo;

    public List<RoadMapMeta> getAll() {
        return repo.findAll();
    }

    public RoadMapMeta createRoadMapMeta(RoadMapMeta roadMapMeta) {
        return repo.save(roadMapMeta);
    }
}
