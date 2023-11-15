package com.braintrain.backend.controller.dtos;

import com.braintrain.backend.model.Resource;

import java.util.List;

public record ResourcesDTO(List<Resource> resources) {
}
