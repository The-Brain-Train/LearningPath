package com.braintrain.backend.util;

import com.braintrain.backend.controller.dtos.NotificationRequestDTO;
import com.braintrain.backend.controller.dtos.NotificationResponseDTO;
import com.braintrain.backend.model.Notification;
import com.braintrain.backend.model.User;
import com.braintrain.backend.service.RoadmapService;
import com.braintrain.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Component
@AllArgsConstructor
public class NotificationConverter {

    private final UserService userService;
    private final RoadmapService roadmapService;

    public Notification fromNotificationRequestDto(NotificationRequestDTO dto) {
        return new Notification(
                dto.message(),
                dto.body(),
                dto.senderEmail(),
                dto.receiverEmail(),
                dto.roadmapMetaId(),
                dto.type()
        );
    }

    public NotificationResponseDTO toNotificationResponseDTO(Notification notification) {

        User sender = userService.getUserByEmail(notification.getSenderEmail());
        String senderName = sender.getName();

        String roadmapName = roadmapService
                        .getRoadmapMetaById(notification.getRoadmapMetaId())
                        .getName();

        Duration timeDiff =
                Duration.between(notification.getTimestamp(), LocalDateTime.now());

        long days = timeDiff.toDays();
        long hours = timeDiff.toHoursPart();
        long minutes = timeDiff.toMinutesPart();
        long seconds = timeDiff.toSecondsPart();

        String timeDiffMessage = "";

        String makePlural = "s";
        if (days == 1 || hours == 1 || minutes == 1 || seconds == 1) {
            makePlural = "";
        }

        if (days > 0) {
            timeDiffMessage = days + " day" + makePlural + " ago";
        } else if (hours > 0) {
            timeDiffMessage = hours + " hour" + makePlural + " ago";
        } else if (minutes > 0) {
            timeDiffMessage = minutes + " minute" + makePlural + " ago";
        } else if (seconds > 0) {
            timeDiffMessage = seconds + " second" + makePlural + " ago";
        } else {
            timeDiffMessage = "Just now";
        }

        return new NotificationResponseDTO(
            notification.getId(),
            notification.getMessage(),
            notification.getBody(),
            notification.getSenderEmail(),
            senderName,
            notification.getReceiverEmail(),
            notification.getRoadmapMetaId(),
            roadmapName,
            notification.getType(),
            notification.getTimestamp(),
            timeDiffMessage,
            notification.isRead(),
            notification.isProcessed()
        );
    }

    public List<NotificationResponseDTO> toNotificationResponseDTOList(
            List<Notification> notifications) {

        return notifications
                .stream()
                .map(this::toNotificationResponseDTO)
                .toList();
    }
}
