package com.braintrain.backend.roadMaps;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoadMapRepository extends MongoRepository<RoadMap, String> {
}
