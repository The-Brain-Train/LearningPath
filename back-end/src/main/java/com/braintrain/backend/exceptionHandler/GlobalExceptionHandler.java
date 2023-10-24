package com.braintrain.backend.exceptionHandler;

import com.braintrain.backend.exceptionHandler.exception.EmailAlreadyExistsException;
import com.braintrain.backend.exceptionHandler.exception.UserNotFoundException;
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

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorMessageResponse> handleUserNotFoundException(UserNotFoundException ex) {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorMessageResponse> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex) {
        ErrorMessageResponse errorResponse = new ErrorMessageResponse(
                LocalDateTime.now(),
                409,
                "/api/auth/signup",
                ex.getMessage()
        );
        return ResponseEntity.status(409).body(errorResponse);
    }
}
