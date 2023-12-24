package com.braintrain.backend.controller.dtos;

import com.braintrain.backend.model.enums.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponseDTO(
        String id,
        String message,
        String body,
        String senderEmail,
        String senderName,
        String receiverEmail,
        String roadmapMetaId,
        String roadmapName,
        NotificationType type,
        LocalDateTime timestamp,
        String timeDiffMessage,
        boolean isRead,
        boolean isProcessed) {
}
