package com.braintrain.backend.roadMaps;

import org.springframework.data.annotation.Id;

public class RoadMapMeta {
    @Id
    private String Id;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    private String name;
}
