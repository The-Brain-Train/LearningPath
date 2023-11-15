package com.braintrain.backend.exceptionHandler.exception;

public class RoadmapNotFoundException extends RuntimeException {

    public RoadmapNotFoundException(String id) {
        super("Roadmap not found for id " + id);
    }
}
