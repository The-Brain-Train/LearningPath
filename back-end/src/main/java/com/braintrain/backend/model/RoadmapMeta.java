package com.braintrain.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;


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
    private Long upVotes = 0L;
    private Long downVotes = 0L;
    private boolean originalOwner;
    @CreatedDate
    private LocalDateTime createdDate;


    public RoadmapMeta(String name, String roadmapReferenceId, String userEmail, String experienceLevel, int hours) {
        this.name = name;
        this.roadmapReferenceId = roadmapReferenceId;
        this.userEmail = userEmail;
        this.experienceLevel = experienceLevel;
        this.hours = hours;
    }

    public RoadmapMeta(String name, String roadmapReferenceId, String userEmail, String experienceLevel, int hours, boolean originalOwner) {
        this.name = name;
        this.roadmapReferenceId = roadmapReferenceId;
        this.userEmail = userEmail;
        this.experienceLevel = experienceLevel;
        this.hours = hours;
        this.originalOwner = originalOwner;
    }
}
