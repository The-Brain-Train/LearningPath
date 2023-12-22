package com.braintrain.backend.exceptionHandler;

import com.braintrain.backend.exceptionHandler.exception.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorMessageResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        return displayErrorMessage(LocalDateTime.now(), 400, "api/roadmaps", ex.getMessage());
    }

    @ExceptionHandler(RoadmapCountExceededException.class)
    public ResponseEntity<ErrorMessageResponse> handleRoadmapCountExceededException(RoadmapCountExceededException ex) {
        return displayErrorMessage(LocalDateTime.now(), 400, "api/roadmaps", ex.getMessage());
    }

    @ExceptionHandler(RoadmapNotFoundException.class)
    public ResponseEntity<ErrorMessageResponse> handleRoadmapNotFoundException(RoadmapNotFoundException ex) {
        return displayErrorMessage(LocalDateTime.now(), 404, "api/roadmaps", ex.getMessage());
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorMessageResponse> handleUserNotFoundException(UserNotFoundException ex) {
        return displayErrorMessage(LocalDateTime.now(), 401, "/api/auth/signin", ex.getMessage());
    }

    @ExceptionHandler(InputFieldException.class)
    public ResponseEntity<ErrorMessageResponse> handleInputFieldException(InputFieldException ex) {
        return displayErrorMessage(LocalDateTime.now(), 400, "/api/auth/signin", ex.getMessage());
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorMessageResponse> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex) {
        return displayErrorMessage(LocalDateTime.now(), 409, "/api/auth/signup", ex.getMessage());
    }

    @ExceptionHandler(InvalidFileContentTypeException.class)
    public ResponseEntity<ErrorMessageResponse> handleInvalidFileContentTypeException(InvalidFileContentTypeException ex) {
        return displayErrorMessage(LocalDateTime.now(), 422, "/api/users", ex.getMessage());
    }

    @ExceptionHandler(ChildElementNotFoundException.class)
    public ResponseEntity<ErrorMessageResponse> handleChildElementNotFoundException(ChildElementNotFoundException ex) {
        return displayErrorMessage(LocalDateTime.now(), 404, "/api/roadmaps", ex.getMessage());
    }

    @ExceptionHandler(RoadmapAlreadyOwnedByUserException.class)
    public ResponseEntity<ErrorMessageResponse> handleRoadmapAlreadyOwnedByUserException(RoadmapAlreadyOwnedByUserException ex) {
        return displayErrorMessage(LocalDateTime.now(), 400, "/api/roadmaps", ex.getMessage());
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
