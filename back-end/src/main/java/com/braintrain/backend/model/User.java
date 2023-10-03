package com.braintrain.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.bind.annotation.CrossOrigin;

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
    private List<RoadmapMeta> favorites = new ArrayList<>();

    public User(String name, String email, List<RoadmapMeta> favorites) {
        this.name = name;
        this.email = email;
        this.favorites = favorites;
    }
}
