package com.braintrain.backend.controller.dtos;

import com.braintrain.backend.model.enums.NotificationType;

import java.time.LocalDateTime;

public record NotificationRequestDTO(
        String message,
        String senderEmail,
        String receiverEmail,
        String roadmapMetaId,
        NotificationType type) {
}
