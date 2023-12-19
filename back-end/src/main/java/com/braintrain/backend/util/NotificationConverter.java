package com.braintrain.backend.util;

import com.braintrain.backend.controller.dtos.NotificationRequestDTO;
import com.braintrain.backend.controller.dtos.NotificationResponseDTO;
import com.braintrain.backend.model.Notification;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class NotificationConverter {

    public static Notification fromNotificationRequestDto(NotificationRequestDTO dto) {
        return new Notification(
                dto.message(),
                dto.body(),
                dto.senderEmail(),
                dto.receiverEmail(),
                dto.roadmapMetaId(),
                dto.type()
        );
    }

    public static NotificationResponseDTO toNotificationResponseDTO(Notification notification) {
        return new NotificationResponseDTO(
            notification.getId(),
            notification.getMessage(),
            notification.getBody(),
            notification.getSenderEmail(),
            notification.getReceiverEmail(),
            notification.getRoadmapMetaId(),
            notification.getType(),
            notification.getTimestamp(),
            notification.isRead()
        );
    }

    public static List<NotificationResponseDTO> toNotificationResponseDTOList(
            List<Notification> notifications) {

        return notifications
                .stream()
                .map(NotificationConverter::toNotificationResponseDTO)
                .toList();
    }
}
