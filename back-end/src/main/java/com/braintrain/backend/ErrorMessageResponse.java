package com.braintrain.backend;

import java.time.LocalDateTime;

public class ErrorMessageResponse {
    private LocalDateTime timestamp;
    private int status;
    private String path;
    private String message;

    public ErrorMessageResponse(LocalDateTime timestamp, int status, String path, String message) {
        this.timestamp = timestamp;
        this.status = status;
        this.path = path;
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
