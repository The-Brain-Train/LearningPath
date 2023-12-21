package com.braintrain.backend.exceptionHandler.exception;

public class RoadmapAlreadyOwnedByUserException extends RuntimeException {
    public RoadmapAlreadyOwnedByUserException() {
        super("User cannot duplicate a roadmap that is already owned by them");
    }
}
