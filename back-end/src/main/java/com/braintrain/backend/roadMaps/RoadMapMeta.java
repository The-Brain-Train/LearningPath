package com.braintrain.backend.roadMaps;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "roadmap_meta")
@Data
@NoArgsConstructor
public class RoadMapMeta {
    @Id
    private String id;

    private String name;

    private String roadMapReferenceId;

    public RoadMapMeta(String name, String roadMapReferenceId) {
        this.name = name;
        this.roadMapReferenceId = roadMapReferenceId;
    }
}
