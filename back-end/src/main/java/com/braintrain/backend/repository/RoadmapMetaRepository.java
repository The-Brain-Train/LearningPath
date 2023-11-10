package com.braintrain.backend.repository;

import com.braintrain.backend.model.RoadmapMeta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoadmapMetaRepository extends MongoRepository<RoadmapMeta, String> {

    Page<RoadmapMeta> findAllByNameContainingIgnoreCaseAndExperienceLevelContainingAndHoursBetween(
            String name, String experienceLevel, int fromHour, int toHour, Pageable pageable);

    default Page<RoadmapMeta> findAllFilteredPaged(
            String name, String experienceLevel, int fromHour, int toHour, Pageable pageable) {
        return findAllByNameContainingIgnoreCaseAndExperienceLevelContainingAndHoursBetween(
                name, experienceLevel, fromHour, toHour, pageable);

    }


}

