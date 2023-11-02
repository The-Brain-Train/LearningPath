package com.braintrain.backend.exceptionHandler;

import com.braintrain.backend.exceptionHandler.exception.EmailAlreadyExistsException;
import com.braintrain.backend.exceptionHandler.exception.InvalidFileContentTypeException;
import com.braintrain.backend.exceptionHandler.exception.RoadmapCountExceededException;
import com.braintrain.backend.exceptionHandler.exception.UserNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({IllegalArgumentException.class, RoadmapCountExceededException.class})
    public ResponseEntity<ErrorMessageResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        return displayErrorMessage(LocalDateTime.now(), 400, "api/roadmaps", ex.getMessage());
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorMessageResponse> handleUserNotFoundException(UserNotFoundException ex) {
        return displayErrorMessage(LocalDateTime.now(), 401, "/api/auth/signin", ex.getMessage());
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorMessageResponse> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex) {
        return displayErrorMessage(LocalDateTime.now(), 409, "/api/auth/signup", ex.getMessage());
    }

    @ExceptionHandler(InvalidFileContentTypeException.class)
    public ResponseEntity<ErrorMessageResponse> handleInvalidFileContentTypeException(InvalidFileContentTypeException ex) {
        return displayErrorMessage(LocalDateTime.now(), 422, "/api/users", ex.getMessage());
    }

    private ResponseEntity<ErrorMessageResponse> displayErrorMessage(LocalDateTime time, int status, String path, String errorMessage) {
        ErrorMessageResponse errorResponse = new ErrorMessageResponse(
                time,
                status,
                path,
                errorMessage
        );
        return ResponseEntity.status(status).body(errorResponse);
    }
}
