package com.braintrain.backend.roadMaps;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Objects;

@Document(collection = "roadmap")
public class RoadMap {
    @Id
    private String id;

    private String obj;

    public RoadMap(){};

    public RoadMap(String obj) {
        this.obj = obj;
    }

    public String getId() {
        return id;
    }

    public String getObj() {
        return obj;
    }

    public void setObj(String obj) {
        this.obj = obj;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RoadMap roadMap)) return false;
        return Objects.equals(getId(), roadMap.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
