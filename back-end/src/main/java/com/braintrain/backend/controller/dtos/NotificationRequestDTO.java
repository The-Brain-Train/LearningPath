package com.braintrain.backend.controller.dtos;

import com.braintrain.backend.model.enums.NotificationType;

public record NotificationRequestDTO(
        String message,
        String body,
        String senderEmail,
        String receiverEmail,
        String roadmapMetaId,
        NotificationType type) {
}
