package com.braintrain.backend.model;

import lombok.Data;

import java.util.List;
@Data
public class RoadmapContent {
    private String name;
    private List<RoadmapContentChild> children;
    private List<Resource> resources;
    private int value;
    private boolean completedTopic;
}