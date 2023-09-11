package com.braintrain.backend.roadMaps;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "roadmap")
public class RoadMap {

    @Id
    private String Id;
    private String name;

}
