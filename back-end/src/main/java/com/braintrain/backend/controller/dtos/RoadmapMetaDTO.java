package com.braintrain.backend.controller.dtos;

public record RoadmapMetaDTO(String name,
                             String roadmapReferenceId,
                             String userEmail,
                             String experienceLevel,
                             int hours) {
}
