package com.braintrain.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private List<RoadmapMeta> favorites;

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public User(String name, String email, List<RoadmapMeta> favorites) {
        this.name = name;
        this.email = email;
        this.favorites = new ArrayList<>();
    }
}
