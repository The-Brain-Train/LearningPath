package com.braintrain.backend.controller.dtos;

import java.util.List;

public record UpVoteDownVoteDTO(
        List<String> upVotes,
        List<String> downVotes) {
}
