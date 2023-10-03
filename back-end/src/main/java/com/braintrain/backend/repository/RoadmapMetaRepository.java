package com.braintrain.backend.repository;

import com.braintrain.backend.model.RoadmapMeta;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoadmapMetaRepository extends MongoRepository<RoadmapMeta, String> {
}

