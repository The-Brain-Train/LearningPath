package com.braintrain.backend.exceptionHandler.exception;

public class RoadmapCountExceededException extends RuntimeException {

    public RoadmapCountExceededException() {
        super("Roadmap count exceeded. User is only allowed to create 10 roadmaps.");
    }
}
