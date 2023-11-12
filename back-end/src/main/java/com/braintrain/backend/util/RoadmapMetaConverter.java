package com.braintrain.backend.util;

import com.braintrain.backend.controller.dtos.RoadmapMetaDTO;
import com.braintrain.backend.model.RoadmapMeta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RoadmapMetaConverter {

    public static Page<RoadmapMetaDTO> toRoadmapMetaDtoList(Page<RoadmapMeta> roadmapMetas) {
        List<RoadmapMetaDTO> dtos = roadmapMetas.stream()
                .map(RoadmapMetaConverter::toRoadmapMetaDto)
                .toList();
        return new PageImpl<>(dtos, roadmapMetas.getPageable(), roadmapMetas.getTotalElements());

    }
    public static RoadmapMetaDTO toRoadmapMetaDto(RoadmapMeta roadmapMeta) {
        return new RoadmapMetaDTO(
                roadmapMeta.getId(),
                roadmapMeta.getName(),
                roadmapMeta.getRoadmapReferenceId(),
                roadmapMeta.getUserEmail(),
                roadmapMeta.getExperienceLevel(),
                roadmapMeta.getHours(),
                roadmapMeta.getUpVotes() != null ? roadmapMeta.getUpVotes() : 0,
                roadmapMeta.getDownVotes() != null ? roadmapMeta.getDownVotes() : 0
        );
    }
}
