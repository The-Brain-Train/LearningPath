package com.braintrain.backend.exceptionHandler.exception;

public class InvalidFileContentTypeException extends RuntimeException {
    public InvalidFileContentTypeException(String message) {
        super(message);
    }
}
