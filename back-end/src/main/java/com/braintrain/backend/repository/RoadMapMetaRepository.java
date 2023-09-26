package com.braintrain.backend.repository;

import com.braintrain.backend.model.RoadMapMeta;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoadMapMetaRepository extends MongoRepository<RoadMapMeta, String> {
}

