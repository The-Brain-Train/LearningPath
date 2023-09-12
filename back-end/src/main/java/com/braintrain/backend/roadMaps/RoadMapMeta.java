package com.braintrain.backend.roadMaps;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Objects;

@Document(collection = "roadmap_meta")
public class RoadMapMeta {
    @Id
    private String id;

    private String name;

    private String roadMapReferenceId;

    public RoadMapMeta(String name) {
        this.name = name;
    }

    public RoadMapMeta(String name, String roadMapReferenceId) {
        this.name = name;
        this.roadMapReferenceId = roadMapReferenceId;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRoadMapReferenceId() {
        return roadMapReferenceId;
    }

    public void setRoadMapReferenceId(String roadMapReferenceId) {
        this.roadMapReferenceId = roadMapReferenceId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RoadMapMeta that)) return false;
        return Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
