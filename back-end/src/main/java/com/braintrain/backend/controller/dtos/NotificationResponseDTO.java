package com.braintrain.backend.controller.dtos;

import com.braintrain.backend.model.enums.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponseDTO(
        String id,
        String message,
        String body,
        String senderEmail,
        String receiverEmail,
        String roadmapMetaId,
        NotificationType type,
        LocalDateTime timestamp,
        boolean isRead) {
}
