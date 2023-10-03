package com.braintrain.backend.model;


import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "roadmap")
@Data
@NoArgsConstructor
public class Roadmap {
    @Id
    private String id;

    private String obj;

    private String userEmail;

    private String experienceLevel;

    private int hours;

    public Roadmap(String obj, String userEmail, String experienceLevel, int hours) {
        this.obj = obj;
        this.userEmail = userEmail;
        this.experienceLevel = experienceLevel;
        this.hours = hours;
    }
}
