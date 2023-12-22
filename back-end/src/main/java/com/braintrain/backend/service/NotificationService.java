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
    private final NotificationConverter converter;

    public Notification addNotification(NotificationRequestDTO dto) {
        Notification notification = converter.fromNotificationRequestDto(dto);
        return repo.save(notification);
    }

    public NotificationResponseDTO getNotificationById(String id) {
        Optional<Notification> notification = repo.findById(id);
        return converter.toNotificationResponseDTO(notification.get());
    }

    public List<NotificationResponseDTO> getAllNotificationsOfUser(String userEmail) {
        List<Notification> notifications = repo.findAllByReceiverEmail(userEmail);
        return converter.toNotificationResponseDTOList(notifications);
    }

    public List<NotificationResponseDTO> getUnreadNotificationsOfUser(String userEmail) {
        List<Notification> unreadNotifications = repo.findAllByReceiverEmailAndIsRead(userEmail, false);
        return converter.toNotificationResponseDTOList(unreadNotifications);
    }

    public NotificationResponseDTO markNotificationAsRead(String id) {
        Optional<Notification> notification = repo.findById(id);
        if (notification.isPresent()) {
            notification.get().setRead(true);
            repo.save(notification.get());
            return converter.toNotificationResponseDTO(notification.get());
        }
        throw new RuntimeException("Notification is not found.");
    }

    public NotificationResponseDTO markNotificationAsUnRead(String id) {
        Optional<Notification> notification = repo.findById(id);
        if (notification.isPresent()) {
            notification.get().setRead(false);
            repo.save(notification.get());
            return converter.toNotificationResponseDTO(notification.get());
        }
        throw new RuntimeException("Notification is not found.");
    }

    public void deleteNotification(String id) {
        repo.deleteById(id);
    }
}
