package com.braintrain.backend.roadMaps;

import org.springframework.data.annotation.Id;

import java.util.Objects;

public class RoadMapMeta {
    @Id
    private String id;

    private String name;


    public RoadMapMeta(String name) {
        this.name = name;
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
