package com.braintrain.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "roadmap_meta")
@Data
@NoArgsConstructor
public class RoadmapMeta {
    @Id
    private String id;
    private String name;
    private String roadmapReferenceId;
    private String userEmail;
    private String experienceLevel;
    private int hours;

    public RoadmapMeta(String name, String roadmapReferenceId, String userEmail, String experienceLevel, int hours) {
        this.name = name;
        this.roadmapReferenceId = roadmapReferenceId;
        this.userEmail = userEmail;
        this.experienceLevel = experienceLevel;
        this.hours = hours;
    }
}