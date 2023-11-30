package com.braintrain.backend.service;

import com.braintrain.backend.controller.dtos.NotificationRequestDTO;
import com.braintrain.backend.controller.dtos.NotificationResponseDTO;
import com.braintrain.backend.model.Notification;
import com.braintrain.backend.repository.NotificationRepository;
import com.braintrain.backend.util.NotificationConverter;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class NotificationService {

    private final NotificationRepository repo;

    public Notification addNotification(NotificationRequestDTO dto) {
        Notification notification = NotificationConverter.fromNotificationRequestDto(dto);
        return repo.save(notification);
    }

    public NotificationResponseDTO getNotificationById(String id) {
        Optional<Notification> notification = repo.findById(id);
        return NotificationConverter.toNotificationResponseDTO(notification.get());
    }

    public List<NotificationResponseDTO> getAllNotificationsOfUser(String userEmail) {
        List<Notification> notifications = repo.findAllByReceiverEmail(userEmail);
        return NotificationConverter.toNotificationResponseDTOList(notifications);
    }

}
