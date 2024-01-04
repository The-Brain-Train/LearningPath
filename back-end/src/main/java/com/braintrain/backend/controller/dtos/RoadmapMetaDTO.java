package com.braintrain.backend.controller.dtos;

import java.time.LocalDateTime;

public record RoadmapMetaDTO(String id,
                             String name,
                             String roadmapReferenceId,
                             String userEmail,
                             String experienceLevel,
                             int hours,
                             Long upVotes,
                             Long downVotes,
                             boolean originalOwner,
                             LocalDateTime createdDate) {
}
