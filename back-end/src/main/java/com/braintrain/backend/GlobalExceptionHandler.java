package com.braintrain.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorMessageResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        ErrorMessageResponse errorResponse = new ErrorMessageResponse(
                LocalDateTime.now(),
                400,
                "api/roadmaps",
                ex.getMessage()
        );
        return ResponseEntity.badRequest().body(errorResponse);
    }
}
