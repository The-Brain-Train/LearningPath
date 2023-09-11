package com.braintrain.backend.roadMaps;

import java.util.List;


public class RoadMapList {

    public List<RoadMapMeta> getRoadMapList() {
        return roadMapList;
    }

    public void setRoadMapList(List<RoadMapMeta> roadMapList) {
        this.roadMapList = roadMapList;
    }

    private List<RoadMapMeta> roadMapList;
}
