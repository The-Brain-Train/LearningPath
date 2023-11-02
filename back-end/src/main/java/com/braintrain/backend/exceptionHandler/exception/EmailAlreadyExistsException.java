package com.braintrain.backend.exceptionHandler.exception;

public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException() {
        super("Email address already in use. Please choose a different email.");
    }
}
