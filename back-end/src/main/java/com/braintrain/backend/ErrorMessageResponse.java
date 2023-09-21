package com.braintrain.backend;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ErrorMessageResponse {
    private LocalDateTime timestamp;
    private int status;
    private String path;
    private String message;
}
