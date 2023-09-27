package com.braintrain.backend.model;


import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Objects;

@Document(collection = "roadmap")
@Data
@NoArgsConstructor
public class RoadMap {
    @Id
    private String id;

    private String obj;

    private String userEmail;

    public RoadMap(String obj, String userEmail) {
        this.obj = obj;
        this.userEmail = userEmail;
    }
}
