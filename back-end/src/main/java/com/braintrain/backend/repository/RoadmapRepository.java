package com.braintrain.backend.repository;

import com.braintrain.backend.model.Roadmap;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoadmapRepository extends MongoRepository<Roadmap, String> {
    Long countByUserEmail(String email);
}
