package com.braintrain.backend.repository;

import com.braintrain.backend.model.RoadMap;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoadMapRepository extends MongoRepository<RoadMap, String> {
}
