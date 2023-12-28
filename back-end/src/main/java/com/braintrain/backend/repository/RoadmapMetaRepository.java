package com.braintrain.backend.repository;

import com.braintrain.backend.model.RoadmapMeta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoadmapMetaRepository extends MongoRepository<RoadmapMeta, String> {

    Page<RoadmapMeta> findAllByNameContainingIgnoreCaseAndExperienceLevelContainingAndHoursBetweenAndOriginalOwnerOrderByCreatedDateDesc(
            String name, String experienceLevel, int fromHour, int toHour, boolean originalOwner, Pageable pageable);

    Page<RoadmapMeta> findAllByNameContainingIgnoreCaseAndExperienceLevelContainingAndHoursBetweenAndOriginalOwnerOrderByCreatedDate(
            String name, String experienceLevel, int fromHour, int toHour, boolean originalOwner, Pageable pageable);

    Page<RoadmapMeta> findAllByNameContainingIgnoreCaseAndExperienceLevelContainingAndHoursBetweenAndOriginalOwner(
            String name, String experienceLevel, int fromHour, int toHour, boolean originalOwner, Pageable pageable);

    default Page<RoadmapMeta> findAllFilteredPaged(
            String name, String experienceLevel, int fromHour, int toHour, String sortedDate, Pageable pageable) {
        if (sortedDate.equals("latest")) {
            return findAllByNameContainingIgnoreCaseAndExperienceLevelContainingAndHoursBetweenAndOriginalOwnerOrderByCreatedDateDesc(
                    name, experienceLevel, fromHour, toHour, true, pageable);
        } else if (sortedDate.equals("earliest")) {
            return findAllByNameContainingIgnoreCaseAndExperienceLevelContainingAndHoursBetweenAndOriginalOwnerOrderByCreatedDate(
                    name, experienceLevel, fromHour, toHour, true, pageable);
        } else {
            return findAllByNameContainingIgnoreCaseAndExperienceLevelContainingAndHoursBetweenAndOriginalOwner(
                    name, experienceLevel, fromHour, toHour, true, pageable);
        }
    }
}

