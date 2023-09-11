package com.braintrain.backend.roadMaps;

import org.springframework.data.annotation.Id;

public class RoadMapMeta {
    @Id
    private String Id;

    private String name;


    public RoadMapMeta(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
