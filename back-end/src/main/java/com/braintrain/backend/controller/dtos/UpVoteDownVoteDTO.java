package com.braintrain.backend.controller.dtos;

import com.braintrain.backend.model.RoadmapMeta;

import java.util.List;

public record UpVoteDownVoteDTO(
        List<String> upVotes,
        List<String> downVotes) {
}
