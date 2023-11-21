package com.braintrain.backend.model;

import lombok.Data;

import java.util.List;

@Data
public class RoadmapContentChild {
    private String name;
    private List<RoadmapContentChild> children;
    private int value;
    private boolean completedTopic;

    public RoadmapContentChild() {
        this.completedTopic = false;
    }
}
